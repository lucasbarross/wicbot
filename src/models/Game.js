var api = require("../util/api_controller");
var messenger = require("../util/messenger");
var client = require("../bot");
var Promise = require("bluebird");
var moment = require("moment");

module.exports = class Game {
  /**
   * @param channel //Channel the game is on
   * @param guild //Guild the game is on
   * @param user //User playing the game
   * @param currentChampion //Current champion player is on
   * @param championIndex (currentChampion index on championsAvailable array)
   * @param championsAvailable //All champions available to the player
   * @param message //Reference to the bot message so we can edit it later
   * @param hinted //If the player asked for a hint in the current champion
   * @param guessEnabled //Enables player to take a guess (stops spamming and therefore bugs)
   * @param hunch // message player sent to try guessing
   */

  constructor(message) {
    this.channel = message.channel;
    this.guild = message.guild;
    this.user = message.author;
    this.guessEnabled = true;
    this.created_at = moment.now();
  }

  getRandomChampion(champions) {
    var index = Math.floor(Math.random() * champions.length);
    return champions[index];
  }

  completeGame(message) {
    client.games.delete(this.user.id);

    return Promise.all([
      api.getText("completeGameText", this.user.lang),
      api.getPlayerStats(this.user.id, this.user.lang),
    ]).spread((text, stats) => {
      if (message) {
        return messenger.editChampionMessage(
          this.user,
          this.message,
          text.data.text.replace("%d", stats.data.total_tries)
        );
      } else {
        return messenger.championMessage(
          this.channel,
          this.user,
          text.data.text.replace("%d", stats.data.total_tries)
        );
      }
    });
  }

  async start(bot) {
    const statusRes = await api.getPlayerStats(this.user.id);

    //Caso o usuário tenha 0 respostas corretas e logo provavelmente é novo no jogo, mostrar a mensagem de começo
    if (statusRes.data.status.count == 0) {
      await messenger.startMessage(this.channel, this.user);
    }

    this.message = await messenger.loadingMessage(this.channel, this.user);

    const response = await api.getChampions(this.user.id);

    if (response.data.length <= 0) {
      return this.completeGame(this.message);
    }

    client.games.set(this.user.id, this);

    console.log("CREATED A GAME INSTANCE");
    console.log("COLLECTION.GAMES:", bot.games.size);

    this.championsAvailable = response.data;

    await this.nextChampion();
  }

  checkBard() {
    if (this.currentChampion.name == "bard" && this.user.lang == "br") {
      this.currentChampion.name = "bardo";
    }
  }

  async nextChampion() {
    const champion = this.getRandomChampion(this.championsAvailable);

    this.guessEnabled = true;
    this.hinted = false;

    if (this.championsAvailable.length > 0) {
      this.currentChampion = champion;
      this.checkBard();
      await messenger.editChampionMessage(
        this.user,
        this.message,
        this.currentChampion.representation
      );
    } else {
      await this.completeGame(this.message);
    }
  }

  skipChampion() {
    var championsAvailableWithoutActualChampion = this.championsAvailable.slice(
      0
    );
    var index = this.currentIndex();
    championsAvailableWithoutActualChampion.splice(index, 1);
    if (championsAvailableWithoutActualChampion.length <= 0) {
      return;
    }

    let champion = this.getRandomChampion(
      championsAvailableWithoutActualChampion
    );
    this.nextChampion(champion);
  }

  async showHint() {
    var hintRes = await api.getHint(
      this.user.id,
      this.currentChampion.name + "Text",
      this.user.lang
    );
    this.hinted = hintRes.data.hint;
    console.log(hintRes.data);
    const msg = await messenger.hintMessage(
      this.message,
      this.channel,
      this.user,
      hintRes.data.message.text
    );
    this.message = msg;
  }

  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  currentIndex() {
    var index = this.championsAvailable
      .map((champion) => {
        return champion.name;
      })
      .indexOf(this.currentChampion.name);
    return index;
  }

  async registerAnswer(hunch) {
    var isCorrect = hunch.content.toLowerCase() == this.currentChampion.name;

    try {
      await hunch.delete({ timeout: 0 });
    } catch (err) {
      console.log("ERROR DELETING HUNCH:", err);
    }

    if (!this.guessEnabled) return;

    this.guessEnabled = false;

    await api.postAnswer(
      this.user.id,
      this.currentChampion.id,
      isCorrect,
      this.hinted
    );
    await messenger.feedbackMessage(
      this.channel,
      this.user,
      this.message,
      isCorrect
    );
    await this.timeout(1000);

    if (isCorrect) {
      this.championsAvailable.splice(this.currentIndex(), 1);
      return this.nextChampion().catch((err) =>
        console.log("ERROR REGISTER ANSWER -> NEXT CHAMPION " + err)
      );
    } else {
      this.guessEnabled = true;
      return messenger
        .editChampionMessage(
          this.user,
          this.message,
          this.currentChampion.representation
        )
        .catch((err) =>
          console.log("ERROR REGISTER ANSWER -> EDIT CHAMPION MESSAGE " + err)
        );
    }
  }
};
