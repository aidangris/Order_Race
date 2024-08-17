<script>

//export default {

import { ref, defineComponent } from 'vue';
import { onBeforeUpdate, onBeforeMount } from 'vue';
//import draggable from 'vuedraggable';
import { VueDraggableNext } from 'vue-draggable-next';
import { evaluate } from 'mathjs'
import { useStore } from 'vuex';
import {computed} from "vue";
import { db, getScoreboard, writeScoreboard, getDailyChallenge, writeDailyChallenge, writeDCscoreboard } from '../firebaseConfig.js';
import { child, onValue, push } from 'firebase/database';
//import { rotate } from 'pngjs'
//let id = 0;

export default {
  components: {
    draggable: VueDraggableNext,
    //math: mathJS
  },
  /*setup(){
    //let gamemode = ref('Gamemode');
    //let difficulty = ref('Difficulty');




    // Close the dropdown menu if the user clicks outside of it
    
  },*/
  data() {
    return {
      enabled: true,
      list: [
        { name: "1", id: 0 },
        { name: "2", id: 1 },
        { name: "3", id: 2 },
        { name: "4", id: 3 },
        { name: "5", id: 4 },
        { name: "6", id: 5 },
        { name: "7", id: 6 },
        { name: "8", id: 7 },
        { name: "9", id: 8 },
        { name: "10", id: 9 }
      ],
      dragging: false,
      hint_given: false,
      timerCount: 0.0,
      setsCleared: 1,
      numSets: 1,
      numBoxes: 10,
      currentHighscore: 0,
      gm: "Gamemode",
      diff: "Difficulty",
      gmList: ["Numbers", "Letters", "Colors", "PHD"],
      colors: ["red", "orange", "yellow", "lime", "green", "teal", "aqua", "blue", "indigo", "violet"],
      inventionList: ["Airplane", "Glasses", "Bicycle", "Camera", "Dishwasher", "Lightbulb", "Ferris Wheel", "Helicopter", "Microscope", "Radio", "Refrigerator", "Rocket Engine", "Steamboat", "Telephone", "Television", "Telescope", "Vacuum Cleaner", "Scissors", "Ruler", "Rubber", "Saddle", "Crossbow", "Catapult", "Water Wheel", "Paper", "Compass", "Toilet Paper", "Toothbrush", "Gunpowder", "Fireworks", "Cannon", "Printing Press", "Piano", "Steam Car", "Atom Bomb", "Personal Computer", "Game Console", "Rubik's Cube", "GPS", "Space Shuttle", "Internet", "Smartphone", "Quantum Computer", "Tank"],
      inventionDate: ["1930",     "1286",    "1816",    "1888",    "1886",     "1878",       "1893",         "1939",        "1677",       "1895",   "1913",       "1926",           "1807",     "1876",       "1909",       "1609",       "1901",         "2000 BC", "2650 BC", "1400 BC", "700 BC", "650 BC", "485 BC",    "350 BC",    "250 BC", "200 BC",  "589",          "619",        "800",        "960",      "1326",     "1439",         "1709",   "1769",      "1945",      "1957",              "1972",        "1974",        "1978", "1981",          "1989",      "1994",        "2010",            "1915"],
      historicalFigures: ["Joan of Arc", "John Lennon", "Charles Darwin", "Albert Einstein", "Mahatma Gandhi", "Nelson Mandella", "Shakespeare", "Van Gogh", "Mozart", "Hellen Keller", "Da Vinci", "Johnny Appleseed", "Isaac Newton", "Beethoven", "Aristotle", "Alexander the Great", "Cleopatra", "Jesus Christ", "Neil Armstrong", "Tom Hanks", "Genghis Khan", "Julius Caesar", "Socrates"],
      historicalFiguresBday: ["1412",     "1940",       "1809",           "1879",            "1869",            "1918",           "1564",         "1853",    "1756",      "1880",       "1452",       "1774",           "1642",         "1770",       "384 BC",   "356 BC",              "69 BC",      "5 BC",        "1930",           "1956",       "1162",         "100 BC",       "468 BC"],
      presidentList: ["George Washington", "John Adams", "Thomas Jefferson", "James Madison", "James Monroe", "John Quincy Adams", "Andrew Jackson", "Martin Van Buren", "William Harrison", "John Tyler", "James K. Polk", "Zachary Taylor", "Millard Fillmore", "Franklin Pierce", "James Buchanan", "Abraham Lincoln", "Andrew Johnson", "Ulysses S. Grant", "Rutherford Hayes", "James Garfield", "Chester A. Arthur", "Grover Cleveland (1st term)", "Benjamin Harrison", "Grover Cleveland (2nd term)", "William McKinley", "Theodore Roosevelt", "William Howard Taft", "Woodrow Wilson", "Warren G. Harding", "Calvin Coolidge", "Herbert Hoover", "Franklin D. Roosevelt", "Harry S. Truman", "Dwight D. Eisenhower", "John F. Kennedy", "Lyndon B. Johnson", "Richard Nixon", "Gerald Ford", "Jimmy Carter", "Ronald Reagan", "George H. W. Bush", "Bill Clinton", "George W. Bush", "Barack Obama", "Donald Trump", "Joe Biden"],
      presidentDates: ["1789",              "1797",       "1801",             "1809",         "1817",           "1825",             "1829",           "1837",             "1841",             "1842",         "1845",         "1849",           "1850",           "1853",             "1857",             "1861",           "1865",           "1869",             "1877",             "1881",           "1882",               "1885",                       "1889",               "1893",                       "1897",             "1901",               "1909",                 "1913",             "1921",           "1923",           "1929",             "1933",                 "1945",             "1953",                 "1961",           "1963",               "1969",             "1974",       "1977",       "1981",         "1989",             "1993",           "2001",           "2009",         "2017",         "2021"],
      message: "Choose a gamemode and difficulty, then press play!",
      menuMessage: "Choose a gamemode and difficulty, then press play!",
      title: "OrderRace",
      scoreBoard: { 
        "Numbers": [0,0,0,0,0],
        "Letters": [0,0,0,0,0],
        "Colors": [0,0,0,0,0],
        "History": [0,0,0,0,0],
        "PHD": [0,0,0,0,0]
      },
      sb: "",
      dcsb: "",
      hint_penalty: 10,
      hint_text: "Hint?\n(10s penalty)",
      sbButton: "Show Scoreboard",
      order: "Lowest to Highest",
      orderList: ["Lowest to Highest", "Highest to Lowest"],
      timerEnabled: false,
      menuTimer: true,
      startScoreboard: true,
      dcGamemode: "",
      dcDiff: "",
      dcOrder: "",
      dailyChallengeClock: true,
      now: "",
      store: useStore(),
      user: computed(() => {
        return this.store.getters.user;
      }),
    };
  },

  watch: {
    dailyChallengeClock(value){
      if (value) {
                    setTimeout(() => {
                        //this.timerCount += 0.05;
                    }, 10000);
                }
    },
    dailyChallengeClock: {
                handler(value) {
                  if (value > 0){
                  setTimeout(() => {
                    this.now = new Date();
                    let str = String(this.now);
                    let arr = str.split(" ");
                    str = arr[0] + " " + arr[1] + " " + arr[2]/* + " " + arr[5]*/;
                    this.now = str;
                    console.log("current time = " + this.now);
                    this.getDC();
                  }, 10000);
                }
                },
                immediate: true // This ensures the watcher is triggered upon creation
            },


    startScoreboard(value){
      if (value) {
                    setTimeout(() => {
                        //this.timerCount += 0.05;
                    }, 1000);
                }
    },
    startScoreboard: {
                handler(value) {
                  setTimeout(() => {
                    if (value > 0 && this.startScoreboard) {
                      this.getUserScoreboard();


                      this.now = new Date();
                      let str = String(this.now);
                      let arr = str.split(" ");
                      str = arr[0] + " " + arr[1] + " " + arr[2]/* + " " + arr[5]*/;
                      this.now = str;
                      this.getDC();

                      console.log("loaded user scoreboard and retrieved/generated daily challenge");
                      this.startScoreboard = false;
                    }
                  }, 1000);
                },
                immediate: true // This ensures the watcher is triggered upon creation
            },


    timerEnabled(value) {
                if (value) {
                    setTimeout(() => {
                        this.timerCount += 0.05;
                    }, 50);
                }
            },

            timerCount: {
                handler(value) {

                    if (value > 0 && this.timerEnabled) {
                        setTimeout(() => {
                            
                            this.timerCount += 0.05;
                            if (this.checkOrder()){
                              if (this.setsCleared >= this.numSets){
                                if (this.gm == "History"){
                                  this.show_history_dates();
                                }
                                console.log('victory!');
                                this.message = "Victory!";
                                this.change_all_color("green");
                                this.timerEnabled = false;
                                //this.setsCleared = 1;
                                this.updateScoreboard(this.timerCount);
                                if (this.gm == this.dcGamemode && this.diff == this.dcDiff && this.order == this.dcOrder){
                                  this.writeDCSB(Math.round(this.timerCount * 100)/100);
                                }
                                
                                document.getElementById("reset").className = "visible";
                                //this.timerCount = 0;
                              } else {
                                console.log('set cleared, updating vals');
                                this.change_all_color("green");
                                
                                this.timerEnabled = false;
                                document.getElementById("next").className="visible";
                                
                              }
                              
                            } else if (this.timerCount >= 20){
                              //this.hint_penalty = 10;
                              document.getElementById("hint").className="visible";
                            }
                        }, 50);
                        
                    }

                },
                immediate: true // This ensures the watcher is triggered upon creation
            }

        },


  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    }
  },
  methods: {
    play: function() {
      this.setsCleared ++;
      this.change_all_color("#2345a9");
      this.updateVals(this.diff, this.gm);
      this.timerEnabled = true;
      document.getElementById("next").className = "gone";
    },

    pause: function() {
        this.timerEnabled = false;
    },
    add: function(n, id) {
      this.list.push({ name: n, id: id });
      setTimeout(() => {
        if (n.length >= 20){
          document.getElementById(id).style.fontSize = "1rem";
        }
      }, 50);
    },
    clear: function() {
      console.log('clearing');
      while (this.list.length > 0){
        this.list.pop();
      }
    },
    writeDC: function(){
      let gm = this.gmList[Math.floor(Math.random() * 4)];
      let diff = String(Math.floor(Math.random() * 5) + 1);
      let order = this.orderList[Math.floor(Math.random() * 2)];
      writeDailyChallenge(this.now, gm, diff, order);
      console.log("created daily challenge " + this.now + ": " + gm + " " + diff + " " + order);
    },
    writeDCSB: function(score){
      console.log("checking " + this.user.data.displayName + " " + score + " in scoreboard");
      let didreplace = false;
      let result = "";
      if (this.dcsb[0] == "1"){
        let sbarr = this.dcsb.split('\n');
        for (let i = 0; i < 10; i ++){
          let sbitem = sbarr[i].split(' ');
          console.log("comparing " + parseFloat(score) + " to " + sbitem[2]);
          if (didreplace){
            sbitem[0] = i+1 + '.';
            sbarr[i] = sbitem.join(' ');
          }
          if ((parseFloat(score) < parseFloat(sbitem[2]) || sbitem[2] == undefined) && !didreplace){
            let item = i+1 + '. ' + this.user.data.displayName + ': ' + score;
            sbarr.splice(i, 0, item);
            didreplace = true;
            console.log("inserted " + item + " in scoreboard position " + i);
            result = sbarr.join('\n');
            console.log(result);
          }
          
        }
        if (didreplace){
          sbarr.splice(10, 1);
          result = sbarr.join('\n');
          console.log(result);
          writeDCscoreboard(this.now, result);
        }
        
      } else {
        let sbarr = ['1. ' + this.user.data.displayName + ': ' + score];
        for (let i = 1; i < 10; i ++){
          sbarr[i] = i+1 + '. ';
        }
        writeDCscoreboard(this.now, sbarr.join('\n'));
        console.log("wrote to dc scoreboard: " + this.user.data.displayName + " " + score);
      }
      
      
    },
    getDC: function(){
      let refArr = getDailyChallenge(this.now);
      console.log("retrieved daily challenge: " + refArr);
      if (refArr != undefined){
        onValue(refArr[0], (snapshot) => {
          console.log('dc gm: ', snapshot.val());
          if (snapshot.val() == null){
            this.writeDC();
            return 0;
          }
          this.dcGamemode = snapshot.val();
        }, {
          onlyOnce: true
        })
        onValue(refArr[1], (snapshot) => {
          this.dcDiff = snapshot.val();
          console.log('dc diff: ', snapshot.val());
        }, {
          onlyOnce: true
        })
        onValue(refArr[2], (snapshot) => {
          this.dcOrder = snapshot.val();
          console.log('dc order: ', snapshot.val());
        }, {
          onlyOnce: true
        })
        onValue(refArr[3], (snapshot) => {
          this.dcsb = snapshot.val();
          console.log('dc sb: ', snapshot.val());
        }, {
          onlyOnce: true
        })
      } else {
        this.writeDC();
      }
    },
    playDC: function() {
      if (this.dcDiff != null){
        console.log("setting menu to dc");
        this.diff = this.dcDiff;
        this.gm = this.dcGamemode;
        this.order = this.dcOrder;
        this.updateVals(this.diff, this.gm)
      }
    },

    getUserScoreboard: function(){
      if (this.user.loggedIn){
        let refArr = getScoreboard(this.user.data.displayName);
        
        if (refArr != undefined){
          
          onValue(refArr[0], (snapshot) => {
          //console.log('snapshot', snapshot)
          snapshot.forEach((childSnapshot) => {
            //console.log('letter diff: ', childSnapshot.key);
            //console.log('val: ', childSnapshot.val());
            this.scoreBoard.Letters[childSnapshot.key] = childSnapshot.val();
            })
          }, {
            onlyOnce: true
          })

          onValue(refArr[1], (snapshot) => {
          //console.log('snapshot', snapshot)
          snapshot.forEach((childSnapshot) => {
            //console.log('number diff: ', childSnapshot.key);
            //console.log('val: ', childSnapshot.val());
            this.scoreBoard.Numbers[childSnapshot.key] = childSnapshot.val();
            })
          }, {
            onlyOnce: true
          })

          onValue(refArr[2], (snapshot) => {
          //console.log('snapshot', snapshot)
          snapshot.forEach((childSnapshot) => {
            //console.log('colors diff: ', childSnapshot.key);
           // console.log('val: ', childSnapshot.val());
            this.scoreBoard.Colors[childSnapshot.key] = childSnapshot.val();
            })
          }, {
            onlyOnce: true
          })

          onValue(refArr[3], (snapshot) => {
          //console.log('snapshot', snapshot)
          snapshot.forEach((childSnapshot) => {
            //console.log('phd diff: ', childSnapshot.key);
            //console.log('val: ', childSnapshot.val());
            this.scoreBoard.History[childSnapshot.key] = childSnapshot.val();
            })
          }, {
            onlyOnce: true
          })

          onValue(refArr[4], (snapshot) => {
          //console.log('snapshot', snapshot)
          snapshot.forEach((childSnapshot) => {
            //console.log('phd diff: ', childSnapshot.key);
            //console.log('val: ', childSnapshot.val());
            this.scoreBoard.PHD[childSnapshot.key] = childSnapshot.val();
            })
          }, {
            onlyOnce: true
          })
          
          console.log('retrieved user ' + this.user.data.displayName + ' scoreboard');
        } else {
          this.updateUserScoreboard();
        }
        
      }
    },
    updateUserScoreboard: function(){
      if (this.user.loggedIn){
       writeScoreboard(this.user.data.displayName, this.scoreBoard);
       console.log('wrote scoreboard to user ' + this.user.data.displayName);
      }
    },
    
    getScore: function(){
      console.log("getting score of " + this.gm + " " + this.diff);
      let index = Number(this.diff)-1;
      switch (this.gm){
        case "Numbers": return this.scoreBoard.Numbers[index]; break;
        case "Letters": return this.scoreBoard.Letters[index]; break;
        case "Colors": return this.scoreBoard.Colors[index]; break;
        case "History": return this.scoreBoard.History[index]; break;
        case "PHD": return this.scoreBoard.PHD[index]; break;
        default: console.log("error: gm not set"); break;
      }
    },
    updateScoreboard: function(time){
      this.getUserScoreboard();
      time = Math.round(time * 100)/100;
      let index = Number(this.diff)-1;
      let stb = 0;
      switch (this.gm){
        case "Numbers": stb = this.scoreBoard.Numbers[index]; break;
        case "Letters": stb = this.scoreBoard.Letters[index]; break;
        case "Colors": stb = this.scoreBoard.Colors[index]; break;
        case "History": stb = this.scoreBoard.History[index]; break;
        case "PHD": stb = this.scoreBoard.PHD[index]; break;
        default: console.log("error: gm not set"); break;
      }
      if (time < stb || stb == 0){
        this.currentHighscore = time;
        switch (this.gm){
          case "Numbers": this.scoreBoard.Numbers[index] = time; break;
          case "Letters": this.scoreBoard.Letters[index] = time; break;
          case "Colors": this.scoreBoard.Colors[index] = time; break;
          case "History": this.scoreBoard.History[index] = time; break;
          case "PHD": this.scoreBoard.PHD[index] = time; break;
          default: console.log("error: gm not set"); break;
        }
        this.updateUserScoreboard();
      }
      this.sb = this.generate_scoreboard();
    },

    hint_func: function(){
      this.hint_given = true;
      //document.getElementById("hint").className = "gone";
      this.timerCount += this.hint_penalty;
      console.log("added " + this.hint_penalty + " to time");
      this.hint_penalty += 10;
      this.hint_text = "Hint?\n(" + this.hint_penalty + "s penalty)";
      let arr = this.getOrder();
      for (let i = 0; i < this.numBoxes; i ++){
        let name = this.getSortingVal(this.list[i].name);
        //console.log("checking val " + name + " against " + )
        if (name == arr[i]){
          this.change_one_color_hint(this.list[i].name);
        }
      }
    },
    show_history_dates: function() {
      
      for (let i = 0; i < this.numBoxes; i ++){
        switch (this.diff){
          case "1": this.list[i].name = this.list[i].name + " - " + this.inventionDate[this.inventionList.indexOf(this.list[i].name)]; break;
          case "2": this.list[i].name = this.list[i].name + " - " + this.historicalFiguresBday[this.historicalFigures.indexOf(this.list[i].name)]; break;
          case "3": this.list[i].name = this.list[i].name + " - " + this.presidentDates[this.presidentList.indexOf(this.list[i].name)]; break;
        }
      }
      setTimeout(() => {
        this.change_all_color("green");
      }, 50);
    },

    sb_toggle: function(){
      console.log("toggling scoreboard");
      this.getUserScoreboard();
      this.getDC();
      let usersb = this.generate_scoreboard();
      if (this.sbButton == "User Scoreboard"){
        usersb = this.generate_scoreboard();
        this.sbButton = "Daily Challenge Scoreboard";
        this.sb = this.dcsb;
        //document.getElementById("sb").className = "visible";
      } else {
        this.sbButton = "User Scoreboard";
        this.sb = usersb;
        //document.getElementById("sb").className = "gone";
      }
    },

    checkMove: function(e) {
      window.console.log("Future index: " + e.draggedContext.futureIndex);
      if (this.hint_given){
        if (this.gm != "Colors"){
          this.default_color();
        } else {
          for (let i in this.list) {
              this.change_one_color(this.list[i].name);
            }
        }
        this.hint_given = false;
      }
    },
    updateNumSets: function(){
      switch(this.diff){
        case "1": this.numSets = 1; break;
        case "2": this.numSets = 1; break;
        case "3": this.numSets = 2; break;
        case "4": this.numSets = 2; break;
        case "5": this.numSets = 3; break;
        default: break;
      }
    },

    romanize: function(num) {
      var lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1},roman = '',i;
      for ( i in lookup ) {
        while ( num >= lookup[i] ) {
          roman += i;
          num -= lookup[i];
        }
      }
      return roman;
    },

    deromanize: function(s) {
      var romanHash = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
      let accumulator = 0;
      for (let i = 0; i < s.length; i++) {
          if (s[i] === "I" && s[i + 1] === "V") {
            accumulator += 4;
            i++;
          } else if (s[i] === "I" && s[i + 1] === "X") {
            accumulator += 9;
            i++;
          } else if (s[i] === "X" && s[i + 1] === "L") {
            accumulator += 40;
            i++;
          } else if (s[i] === "X" && s[i + 1] === "C") {
            accumulator += 90;
            i++;
          } else if (s[i] === "C" && s[i + 1] === "D") {
            accumulator += 400;
            i++;
          } else if (s[i] === "C" && s[i + 1] === "M") {
            accumulator += 900;
            i++;
          } else {
            accumulator += romanHash[s[i]];
          }
      }
      return accumulator;
    },
    selectColor: function(colorNum, colors){
      if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
      return "hsl(" + (colorNum * (345 / colors) % 345) + ",100%,50%)";
    },
    

    generateVal: function(length, gm, i) {
      let result = '';
      //const capletters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const allletters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const nums = '0123456789';
      const hex = '0123456789ABCDEF';
      
      let colors = this.colors;
      let counter = 0;
      let c = '';
      let operation = 0;
      let num1 = 0;
      let num2 = 0;
      
      while (true){
        counter = 0;
        result = '';
        if (gm == 'PHD'){
          switch (length){
            case '1': for (let i = 0; i < 5; i ++){ result += nums.charAt(Math.floor(Math.random() * 2)); } break;
            case '2': result = this.romanize(Math.floor(Math.random() * 20) + 1); break;
            case '3': result = '0x'; for (let i = 0; i < 5; i ++){ result += hex.charAt(Math.floor(Math.random() * hex.length)); } break;
            case '4':
              operation = Math.floor(Math.random() * 4);
              num1 = Math.floor(Math.random() * 10);
              num2 = Math.floor(Math.random() * 10);
              switch (operation){
                case 0: result = '' + num1 + ' + ' + num2; break;
                case 1: result = '' + num1 + ' - ' + num2; break;
                case 2: result = '' + num1 + ' * ' + num2; break;
                case 3: result = '' + num1 + ' / ' + num2; break;
              }
              break;
            case '5':
              operation = Math.floor(Math.random() * 5);
              num1 = Math.floor(Math.random() * 100);
              num2 = Math.floor(Math.random() * 100);
              let num3 = Math.floor(Math.random() * 100);
              switch (operation){
                case 0: result = '' + num1 + ' + ' + num2; break;
                case 1: result = '' + num1 + ' - ' + num2; break;
                case 2: result = '' + num1 + ' * ' + num2; break;
                case 3: result = '' + num1 + ' / ' + num2; break;
                case 4: result = '' + num1 + ' ^ ' + num2; break;
              }
              operation = Math.floor(Math.random() * 5);
              switch (operation){
                case 0: result += ' + ' + num3; break;
                case 1: result += ' - ' + num3; break;
                case 2: result += ' * ' + num3; break;
                case 3: result += ' / ' + num3; break;
                case 4: result += ' ^ ' + num3; break;
              }
              break;
            default: result = 'err';
          }
        } else if (gm == "Colors"){
          switch (length){
            //case '1': result = colors[Math.floor(Math.random() * colors.length)]; break;
            case '1': let x = Math.floor(255/10 * (Math.floor(Math.random()*10)+1)); result = 'rgb('+x+', '+x+', '+x+ ')'; break;
            case '2': result = this.selectColor(Math.floor(Math.random() * 10), 10); break;
            case '3': result = this.selectColor(Math.floor(Math.random() * 20), 20); break;
            case '4': result = this.selectColor(Math.floor(Math.random() * 30), 30); break;
            case '5': result = this.selectColor(Math.floor(Math.random() * 40), 40); break;
          }
          
        } else if (gm == "History"){
          switch (length){
            case '1': result = this.inventionList[Math.floor(Math.random()*this.inventionList.length)]; break;
            case '2': result = this.historicalFigures[Math.floor(Math.random()*this.historicalFigures.length)]; break;
            case '3': result = this.presidentList[Math.floor(Math.random()*this.presidentList.length)]; break;
            default: console.log("gamemode not finished"); break;
          }
        } else {
          while (counter < length) {
            switch (gm){
              case "Letters": c = allletters.charAt(Math.floor(Math.random() * allletters.length)); break;
              case "Numbers": c = nums.charAt(Math.floor(Math.random() * nums.length)); break;
              
              //case "PHD": c = characters.charAt(Math.floor(Math.random() * charactersLength)); break;
              default: c = '1';
            }
            result += c;
            counter += 1;
          }
        }
        
        console.log(result);
        if (!this.get_duplicates(result) || this.list.length == this.numBoxes){
          break;
        }
        console.log('generated duplicate ' + result);
      }
      if (result != null && this.list.length < this.numBoxes){
        this.add(result, i);
      }
      
    },
    updateVals: function(difficulty, gm){
      this.diff = difficulty;
      this.gm = gm;
      this.updateNumSets();
      if (difficulty != 'Difficulty' && gm != 'Gamemode'){
        this.currentHighscore = this.getScore();
        console.log("current highscore = " + this.currentHighscore);
        setTimeout(() => {
          if (this.timerEnabled == false){
            document.getElementById("play").className="visible";
          }
        }, 10);
        
        console.log('generating vals');
        this.clear();
        for (let i = 0; i < this.numBoxes; i++)  {
          
          console.log('generating val of length ' + difficulty);
          let c = this.generateVal(difficulty, gm, i);
          //replace(c);
        }
        let color_bar = document.getElementById('color_bar');
        if (gm == 'Colors'){
          if (this.diff > 1){
            if (this.order == 'Lowest to Highest'){
              color_bar.className = "visible";
            } else {
              color_bar.className = "visible_flipped";
            }
          }
          
          setTimeout(() => {
            for (let i in this.list) {
              this.change_one_color(this.list[i].name);
            }
          }, 10);
        } else {
          color_bar.className = "gone";
        }
        
      }
      
    },
    

    checkOrder: function(){
      let gm = this.gm;
      let diff = this.diff;
      let colors = this.colors;
      for (let i = 0; i < this.numBoxes-1; i ++){
        //let id0 = this.list.find((element) => element.id == i).name;
        //let id1 = this.list.find((element) => element.id == i+1).name;
        let id0 = this.getSortingVal(this.list[i].name);
        let id1 = this.getSortingVal(this.list[i+1].name);
        

        if (this.order == 'Lowest to Highest'){
          if (id0 > id1){
            return false;
          }
        } else {
          if (id0 < id1){
            return false;
          }
        }
      }
      
      return true;
    },

    getSortingVal: function(name){
      let gm = this.gm;
      let diff = this.diff;
      //let result = "";

      let id0 = name.toLowerCase();
        
        if (gm == "PHD"){
          if (diff == 2){
            id0 = this.deromanize(name);
          } else if (diff == 4 || diff == 5){
            /*for (let x in this.list){
              console.log(this.list[x].name + ' evaluates to ' + evaluate(this.list[x].name));
            }*/
            id0 = evaluate(id0);
          }
        }
        
        if (gm == "Colors"){
          id0 = Number(id0.substring(4, id0.indexOf(',')));
          if (diff == 1){
            id0 = 1000 - id0;
          }
        }

        if (gm == "History"){
          id0 = name;
          let d0 = "";
          switch(diff){
            case "1": d0 = this.inventionDate[this.inventionList.indexOf(id0)]; break;
            case "2": d0 = this.historicalFiguresBday[this.historicalFigures.indexOf(id0)]; break;
            case "3": d0 = this.presidentDates[this.presidentList.indexOf(id0)];
          }
          
          d0 = d0.split(' ');
          if (d0.length > 1){
            id0 = parseInt(d0[0]) * -1;
          } else {
            id0 = parseInt(d0[0]);
          }
        }

        return id0;
    },
    compareNumbers: function(a, b) {
      return a - b;
    },
    getOrder: function(){
      let gm = this.gm;
      let diff = this.diff;
      let result = [];
      for (let i = 0; i < this.numBoxes; i ++){
        let id0 = this.getSortingVal(this.list[i].name);
        result.push(id0);
      }
      result.sort(this.compareNumbers);
      if (this.order != "Lowest to Highest"){
        result.reverse();
      }
      console.log("sorted items: " + result);
      return result;
    },

    get_duplicates: function(n){
      for (let elem in this.list){
        if (this.list[elem].name == n){
          console.log('duplicates found');
          return true;
        }
      }
      return false;
    },

    gamemodedrop: function() {
      document.getElementById("gamemode").classList.toggle("show");
      //this.updateVals();
    },
    difficultydrop: function() {
      document.getElementById("difficulty").classList.toggle("show");
      //this.updateVals();
    },
    orderdrop: function() {
      document.getElementById("order").classList.toggle("show");
      //this.updateVals();
    },
    generate_scoreboard: function(){
      let sb = "Numbers:\n";
      for (let i = 0; i < 5; i++){
        sb += "" + (i+1) + ": " + this.scoreBoard.Numbers[i] + "\n";
      }
      sb += "\nLetters:\n";
      for (let i = 0; i < 5; i++){
        sb += "" + (i+1) + ": " + this.scoreBoard.Letters[i] + "\n";
      }
      sb += "\nColors:\n";
      for (let i = 0; i < 5; i++){
        sb += "" + (i+1) + ": " + this.scoreBoard.Colors[i] + "\n";
      }
      sb += "\n History:\n";
      for (let i = 0; i < 5; i++){
        sb += "" + (i+1) + ": " + this.scoreBoard.History[i] + "\n";
      }
      sb += "\nPHD:\n";
      for (let i = 0; i < 5; i++){
        sb += "" + (i+1) + ": " + this.scoreBoard.PHD[i] + "\n";
      }
      console.log("generated scoreboard\n" + sb);
      return sb;
    },

    change_all_color: function(color){
      console.log("changing all colors to " + color);
      for (let i = 0; i < this.numBoxes; i ++){
        let box = document.getElementById(this.list[i].name);
        if (box != null){
          box.style.backgroundColor = color;
        } else {
          console.log("can't change color");
        }
      }
      
      
    },
    change_one_color: function(color){
      console.log("changing color of box " + color)
      let box = document.getElementById(color);
      if (box != null){
        box.style.backgroundColor = color;
        box.style.color = "transparent";
        return true;
      } else {
        console.log("can't change color");
        return false;
      }
      
    },
    change_one_color_hint: function(name){
      console.log("changing color of box " + name)
      let box = document.getElementById(name);
      if (box != null){
        box.style.backgroundColor = "green";
        //box.style.color = "transparent";
        return true;
      } else {
        console.log("can't change color");
        return false;
      }
      
    },
    default_color: function(){
      for (let i in this.list){
        console.log("changing color of element " + this.list[i].name)
        let box = document.getElementById(this.list[i].name);
        if (box != null){
          box.style.color = "black";
          box.style.backgroundColor = "#2345a9";
        } else {
          console.log("can't change color");
        }
      
      }
    },

    gameloop: function(difficulty, gm){
      //this.diff = difficulty;
      //this.gm = gm;
      //console.log('set diff to ' + this.diff + ' and gm to ' + this.gm);
      if (this.order == 'Lowest to Highest'){
        if (this.gm == "Colors"){
          this.message = "Sort in ROYGBIV!";
        } else {
          this.message = "Sort from lowest to highest!";
        }
      } else {
        if (this.gm == "Colors"){
          this.message = "Sort in VIBGYOR!";
        } else {
          this.message = "Sort from highest to lowest!";
        }
      }
      switch(this.diff){
        case 1: this.numSets = 1; break;
        case 2: this.numSets = 1; break;
        case 3: this.numSets = 2; break;
        case 4: this.numSets = 2; break;
        case 5: this.numSets = 3; break;
      }
      
      
      document.getElementById("dropContent").className = "gone";
      document.getElementById("play").className = "gone";
      document.getElementById("reset").className = "gone";
      document.getElementById("sbButton").className = "gone";
      document.getElementById("timer").className = "visible";
      document.getElementById("dcbutton").className = "gone";
      document.getElementById("sb").className = "gone";
      this.updateVals(this.diff, this.gm);
      this.dailyChallengeClock = false;
      this.timerEnabled = true;
      
      

    }, 

    reset: function(){
      console.log("resetting");
      if (this.timerEnabled == false){
        /*for (let i = 1; i <= 5; i++){
          this.list[i-1].name = i.toString();
        }*/
        this.updateVals(this.diff, this.gm);
        this.default_color();
        //this.scoreBoard.push('New time: ' + this.timerCount);
        this.timerCount = 0.0;
        this.message = this.menuMessage;
        
        document.getElementById("dropContent").className = "visible";
        document.getElementById("play").className = "visible";
        document.getElementById("reset").className = "gone";
        document.getElementById("sbButton").className = "visible";
        document.getElementById("timer").className = "gone";
        document.getElementById("dcbutton").className = "visible";
        document.getElementById("sb").className = "visible";
        document.getElementById("hint").className = "gone";
        this.hint_penalty = 10;
        this.hint_text = "Hint?\n(" + this.hint_penalty + "s penalty)";
        this.getDC();
        this.dailyChallengeClock = true;
        
      } else {
        this.change_all_color('light blue');
        console.log("error: game running");
      }
    }, 
  }

  

};


</script>

<script setup>

window.onclick = function(event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      }
    }






onBeforeUpdate(() => {
 })







//})


</script>


<template>
  <div id="menuContent">
    <h1> {{  message }}</h1>
    <button id="reset" class="gone" @click="reset()">Reset</button>
    <button id="dcbutton" class="visible" @click="playDC()">Daily Challenge</button>
    <div id="dropContent">
      <div id="dropItem">
        <h2>Gamemode: </h2>
        <div class="dropdown">
          <button @click="gamemodedrop(); updateVals(diff, gm)" class="dropbtn">{{ gm }}</button>
          
            <div id="gamemode" class="dropdown-content">
              <a href="#" @click="gm = 'Letters'; updateVals(diff, gm)">Letters</a>
              <a href="#" @click="gm = 'Numbers'; updateVals(diff, gm)">Numbers</a>
              <a href="#" @click="gm = 'Colors'; updateVals(diff, gm)">Colors</a>
              <a href="#" @click="gm = 'History'; updateVals(diff, gm)">History</a>
              <a href="#" @click="gm = 'PHD'; updateVals(diff, gm)">PHD</a>
            </div>
          
        </div>
      </div>
      <div id="dropItem">
        <h2>Difficulty:</h2>
        <div class="dropdown">
          <button @click="difficultydrop(); updateVals(diff, gm)" class="dropbtn">{{ diff }}</button>
          
            <div id="difficulty" class="dropdown-content">
              <a href="#" @click="diff = '1'; updateVals(diff, gm)">1</a>
              <a href="#" @click="diff = '2'; updateVals(diff, gm)">2</a>
              <a href="#" @click="diff = '3'; updateVals(diff, gm)">3</a>
              <a href="#" @click="diff = '4'; updateVals(diff, gm)">4</a>
              <a href="#" @click="diff = '5'; updateVals(diff, gm)">5</a>
            </div>
          
        </div>
      </div>
      <div id="dropItem">
        <h2>Order:</h2>
        <div class="dropdown">
          <button @click="orderdrop(); updateVals(diff, gm)" class="dropbtn">{{ order }}</button>
          
            <div id="order" class="dropdown-content">
              <a href="#" @click="order = 'Lowest to Highest'; updateVals(diff, gm)">Lowest to Highest</a>
              <a href="#" @click="order = 'Highest to Lowest'; updateVals(diff, gm)">Highest to Lowest</a>
              
            </div>
          
        </div>
      </div>
    </div>
    <button id="play" class="gone" @click="gameloop(difficulty, gamemode)">Play!</button>
    
    
  </div>
  
  <div id="gameContent">
    <div class="col-6">
      
        <h5 id="timer" class="gone">{{setsCleared}} / {{numSets}} : {{ Math.round(timerCount*100)/100 }}</h5>
        <button id="next" class="gone" @click="play()">Next</button>
        <button id="hint" class="gone" @click="hint_func()">{{hint_text}}</button>
          <h4><draggable
            :list="list"
            :disabled="!enabled"
            item-key="name"
            class="list-group"
            ghost-class="ghost"
            :move="checkMove"
            @start="dragging = true"
            @end="dragging = false"
          >
            <div
              class="list-group-item"
              v-for="element in list"
              :key="element.name"
            >
            <h3 :id="element.name">
              {{ element.name }}
            </h3>
            </div>
          </draggable></h4>
      
    </div>
  </div>
  
  <div id="rightBar">
    <h2 id="highscore">Highscore: {{ currentHighscore }}</h2>
    <img alt="color bar" id="color_bar" class="gone" src="./color_stripe.jpeg" width="60" height="600" />
  </div>

  <div id="scoreBar">
    <button id = "sbButton" class = "visible" @click="sb_toggle()">{{ sbButton }}</button>
    <h6 id="sb" class = "visible">{{ sb }}</h6>
  </div>
  
    
     
</template>



<style scoped>
.dropbtn {
  background-color: #3498DB;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

/* Dropdown button on hover & focus */
.dropbtn:hover, .dropbtn:focus {
  background-color: #2980B9;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
  padding-bottom: 10px;
  padding-left: 10px;
  width: 35%;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

/* Change color of dropdown links on hover */
.dropdown-content a:hover {background-color: #ddd;}

/* Show the dropdown menu (use JS to add this class to the .dropdown-content container when the user clicks on the dropdown button) */
.show {display:block;}

.list-group-item{
  height: 8.5vh;
  width: 25vw;
  background-color: transparent;
  border-color: transparent;
}

h1 {
  font-weight: 500;
  font-size: 1.6rem;
  position: static;
  top: -10px;
  padding: 20px;
  padding-bottom: 60px;
}
h2 {
  margin-left: 30px;
  padding-bottom: 10px;
  width: 40%;
  font-size: 1.9rem;
  text-align: right;
  float: left;
  display: inline;
}
h3 {
  border: 2px solid #ffffff;
  padding: 10px;
  margin: 15px;
  margin-left: -20px;
  margin-top: -10px;
  width: 25vw;
  height: 8vh;
  text-align: center;
  font-weight: 500;
  font-size: auto;
  color: black;
  background-color: #2345a9;
  
}
h4 {
  position: static;
  margin-top: 25px;
  height: 100vh;
}

h5 {
  font-weight: 400;
  font-size: 1.4rem;
  float: left;
  position: inline;
  width: 70%;
  
}

h6 {
  font-weight: 300;
  font-size: 0.9rem;
  overflow-y: auto;
}



.box {
  border: 1px solid #000;
  padding: 15px;
  margin: 15px;
  width: 20vw;
  text-align: center;
  color: black;
  background-color: #f9f9f9;
}

.dropdown{
  float: left;
  display: inline;
  width: 49%;
}

.ghost {
  opacity: 0.5;
}
.gone {
  opacity: 0;
  pointer-events: none;
}
.visible {
  opacity: 1;
  pointer-events: auto;
}
.visible_flipped {
  opacity: 1;
  pointer-events: auto;
  transform: rotate(180deg);
}

#play{
  width: 100px;
  height: 25px;
  margin-top: 50px;
  margin-left: 50px;
}

#reset{
  width: 80px;
  height: 40px;
}

#dcbutton{
  display: inline;
  margin-bottom: 20px;
}

#dropItem{
  display: block;
  float: center;
  margin-bottom: 20px;
}

#next{
  margin-left: 0px;
  display: inline;
  
}
#hint{
  display: inline;
  float: right;
}

#timer{
  width: 25vw;
  display: block;
}

#menuContent{
  float: left;
  display: inline;
  width: 27vw;
}
#gameContent{
  float: left;
  display: middle;
  width: 25vw;
  margin-left: -50px;
}
#rightBar{
  float: left;
  display: inline;
  width: 18vw;
  
}
#scoreBar{
  float: left;
  display: inline;
  width: 10vw;
  height: 90vh;
}
#sbButton{
  
  width: 100%;
}
#sb{
  float: left;
  display: inline;
  white-space: pre-line;
  margin-top: 25px;
  width: 10vw;
  height: 80%;
  font-weight: 400;
  color: white;
  font-size: 1.2rem;
}
#highscore{
  float: left;
  display: inline;
}
#color_bar{
  float: left;
  display: inline;
  margin-left: -5vw;
  margin-top: 15vh;
  
}

</style>
