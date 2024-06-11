<script>

//export default {

import { ref, defineComponent } from 'vue';
import { onBeforeUpdate, onBeforeMount } from 'vue';
//import draggable from 'vuedraggable';
import { VueDraggableNext } from 'vue-draggable-next'
import { evaluate } from 'mathjs'
//import { rotate } from 'pngjs'
//let id = 0;

export default {
  components: {
    draggable: VueDraggableNext,
    //math: mathJS
  },
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
      timerCount: 0.0,
      setsCleared: 1,
      numSets: 3,
      numBoxes: 10,
      currentHighscore: 0,
      gm: "Gamemode",
      diff: "Difficulty",
      colors: ["red", "orange", "yellow", "lime", "green", "teal", "aqua", "blue", "indigo", "violet"],
      message: "Choose a gamemode and difficulty, then press play!",
      menuMessage: "Choose a gamemode and difficulty, then press play!",
      title: "OrderRace",
      scoreBoard: { 
        "Numbers": [0,0,0,0,0],
        "Letters": [0,0,0,0,0],
        "Colors": [0,0,0,0,0],
        "PHD": [0,0,0,0,0]
      },
      sb: "Numbers:\n1: 0\n2: 0\n3: 0\n4: 0\n5: 0\n\nLetters:\n1: 0\n2: 0\n3: 0\n4: 0\n5: 0\n\nColors:\n1: 0\n2: 0\n3: 0\n4: 0\n5: 0\n\nPHD:\n1: 0\n2: 0\n3: 0\n4: 0\n5: 0",
      sbButton: "Show Scoreboard",
      order: "Lowest to Highest",
      timerEnabled: false,
      menuTimer: true
    };
  },

  watch: {
    /*menuTimer(value){
      if (value) {
          setTimeout(() => {
              this.timerCount += 0.05;
          }, 50);
      }
    },*/
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
                                console.log('victory!');
                                this.message = "Victory!";
                                this.change_all_color("green");
                                this.timerEnabled = false;
                                this.setsCleared = 1;
                                this.updateScoreboard(this.timerCount);
                                document.getElementById("reset").className = "visible";
                                //this.timerCount = 0;
                              } else {
                                console.log('set cleared, updating vals');
                                this.change_all_color("green");
                                
                                this.timerEnabled = false;
                                document.getElementById("next").className="visible";
                                
                              }
                              
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
    },
    clear: function() {
      console.log('clearing');
      while (this.list.length > 0){
        this.list.pop();
      }
    },
    
    getScore: function(){
      console.log("getting score of " + this.gm + " " + this.diff);
      let index = Number(this.diff)-1;
      switch (this.gm){
        case "Numbers": return this.scoreBoard.Numbers[index]; break;
        case "Letters": return this.scoreBoard.Letters[index]; break;
        case "Colors": return this.scoreBoard.Colors[index]; break;
        case "PHD": return this.scoreBoard.PHD[index]; break;
        default: console.log("error: gm not set"); break;
      }
    },
    updateScoreboard: function(time){
      time = Math.round(time * 100)/100;
      let index = Number(this.diff)-1;
      let stb = 0;
      switch (this.gm){
        case "Numbers": stb = this.scoreBoard.Numbers[index]; break;
        case "Letters": stb = this.scoreBoard.Letters[index]; break;
        case "Colors": stb = this.scoreBoard.Colors[index]; break;
        case "PHD": stb = this.scoreBoard.PHD[index]; break;
        default: console.log("error: gm not set"); break;
      }
      if (time < stb || stb == 0){
        switch (this.gm){
          case "Numbers": this.scoreBoard.Numbers[index] = time; break;
          case "Letters": this.scoreBoard.Letters[index] = time; break;
          case "Colors": this.scoreBoard.Colors[index] = time; break;
          case "PHD": this.scoreBoard.PHD[index] = time; break;
          default: console.log("error: gm not set"); break;
        }
      }
      this.sb = this.generate_scoreboard();
    },
    sb_toggle: function(){
      if (this.sbButton == "Show Scoreboard"){
        this.sbButton = "Hide Scoreboard";
        document.getElementById("sb").className = "visible";
      } else {
        this.sbButton = "Show Scoreboard";
        document.getElementById("sb").className = "gone";
      }
    },

    checkMove: function(e) {
      window.console.log("Future index: " + e.draggedContext.futureIndex);
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
              switch (operation){
                case 0: result = '' + num1 + ' + ' + num2; break;
                case 1: result = '' + num1 + ' - ' + num2; break;
                case 2: result = '' + num1 + ' * ' + num2; break;
                case 3: result = '' + num1 + ' / ' + num2; break;
                case 4: result = '' + num1 + ' ^ ' + num2; break;
              }
              operation = Math.floor(Math.random() * 5);
              switch (operation){
                case 0: result += ' + ' + num2; break;
                case 1: result += ' - ' + num2; break;
                case 2: result += ' * ' + num2; break;
                case 3: result += ' / ' + num2; break;
                case 4: result += ' ^ ' + num2; break;
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
        let id0 = this.list[i].name.toLowerCase();
        let id1 = this.list[i+1].name.toLowerCase();
        //console.log('comparing ' + id0 + ' with ' + id1)
        if (gm == "PHD"){
          if (diff == 2){
            id0 = this.deromanize(this.list[i].name);
            id1 = this.deromanize(this.list[i+1].name);
          } else if (diff == 4 || diff == 5){
            for (let x in this.list){
              console.log(this.list[x].name + ' evaluates to ' + evaluate(this.list[x].name));
            }
            id0 = evaluate(id0);
            id1 = evaluate(id1);
            
          }
        }
        
        if (gm == "Colors"){
          id0 = Number(id0.substring(4, id0.indexOf(',')));
          id1 = Number(id1.substring(4, id1.indexOf(',')));
          if (diff == 1){
            id0 = 1000 - id0;
            id1 = 1000 - id1;
          }
        }

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
      sb += "\nPHD:\n";
      for (let i = 0; i < 5; i++){
        sb += "" + (i+1) + ": " + this.scoreBoard.PHD[i] + "\n";
      }
      console.log("generated scoreboard\n" + sb);
      return sb;
    },

    change_all_color: function(color){
      console.log("changing all colors to " + color);
      for (let i = 0; i < 10; i ++){
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
        box.style.color = color;
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
      this.diff = difficulty;
      this.gm = gm;
      console.log('set diff to ' + this.diff + ' and gm to ' + this.gm);
      if (this.order == 'Lowest to Highest'){
        if (gm == "Colors"){
          this.message = "Sort in ROYGBIV!";
        } else {
          this.message = "Sort from lowest to highest!";
        }
      } else {
        if (gm == "Colors"){
          this.message = "Sort in VIBGYOR!";
        } else {
          this.message = "Sort from highest to lowest!";
        }
      }
      
      
      document.getElementById("dropContent").className = "gone";
      document.getElementById("play").className = "gone";
      document.getElementById("reset").className = "gone";
      document.getElementById("sbButton").className = "gone";
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
        
        
      } else {
        this.change_all_color('light blue');
        console.log("error: game running");
      }
    }
  }

  

};


</script>

<script setup>



let gamemode = ref('Gamemode');
let difficulty = ref('Difficulty');




// Close the dropdown menu if the user clicks outside of it
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


onBeforeMount(() => {
  
})

onBeforeUpdate(() => {
 })







//})

</script>


<template>
  <div id="menuContent">
    <h7> OrderRace </h7>
    <h1> {{  message }}</h1>
    <button id = "reset" class = "gone" @click="reset()">Reset</button>
    <div id="dropContent">
      <h2>Gamemode:</h2>
      <div class="dropdown">
        <button @click="gamemodedrop(); updateVals(difficulty, gamemode)" class="dropbtn">{{ gamemode }}</button>
        
          <div id="gamemode" class="dropdown-content">
            <a href="#" @click="gamemode = 'Letters'; updateVals(difficulty, gamemode)">Letters</a>
            <a href="#" @click="gamemode = 'Numbers'; updateVals(difficulty, gamemode)">Numbers</a>
            <a href="#" @click="gamemode = 'Colors'; updateVals(difficulty, gamemode)">Colors</a>
            <a href="#" @click="gamemode = 'PHD'; updateVals(difficulty, gamemode)">PHD</a>
          </div>
        
      </div>
      <h2>Difficulty:</h2>
      <div class="dropdown">
        <button @click="difficultydrop(); updateVals(difficulty, gamemode)" class="dropbtn">{{ difficulty }}</button>
        
          <div id="difficulty" class="dropdown-content">
            <a href="#" @click="difficulty = '1'; updateVals(difficulty, gamemode)">1</a>
            <a href="#" @click="difficulty = '2'; updateVals(difficulty, gamemode)">2</a>
            <a href="#" @click="difficulty = '3'; updateVals(difficulty, gamemode)">3</a>
            <a href="#" @click="difficulty = '4'; updateVals(difficulty, gamemode)">4</a>
            <a href="#" @click="difficulty = '5'; updateVals(difficulty, gamemode)">5</a>
          </div>
        
      </div>
      <h2>Order:</h2>
      <div class="dropdown">
        <button @click="orderdrop();" class="dropbtn">{{ order }}</button>
        
          <div id="order" class="dropdown-content">
            <a href="#" @click="order = 'Lowest to Highest'; ">Lowest to Highest</a>
            <a href="#" @click="order = 'Highest to Lowest'; ">Highest to Lowest</a>
            
          </div>
        
      </div>
    </div>
    <button id = "play" class = "gone" @click="gameloop(difficulty, gamemode)">Play!</button>
    
    
  </div>
  
  <div id="gameContent">
    <div class="col-6">
      
        <h5>{{setsCleared}} / {{numSets}} : {{ Math.round(timerCount*100)/100 }}</h5>
        <button id = "next" class = "gone" @click="play()">Next</button>
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
    <h6 id="sb" class = "gone">{{ sb }}</h6>
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
  float: left;
  display: inline;
}
h3 {
  border: 2px solid #ffffff;
  padding: 10px;
  margin: 10px;
  width: 200px;
  height: 50px;
  text-align: center;
  font-weight: 500;
  color: black;
  background-color: #2345a9;
  
}
h4 {
  position: static;
  margin-top: 25px;
  
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
}
h7 {
  font-weight: 600;
  font-size: 4rem;
  color: red;
}


.box {
  border: 1px solid #000;
  padding: 10px;
  margin: 10px;
  width: 200px;
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
  height: 20px;
}

#next{
  margin-left: 0px;
}

#menuContent{
  float: left;
  display: inline;
  width: 30%;
}
#gameContent{
  float: left;
  display: middle;
  width: 23%;
  margin-left: 0px;
}
#rightBar{
  float: left;
  display: inline;
  width: 35%;
  
}
#scoreBar{
  float: left;
  display: inline;
  width: 10%;
}
#sbButton{
  
  width: 100%;
}
#sb{
  float: left;
  display: inline;
  white-space: pre-line;
  height: 80%
}
#highscore{
  float: left;
  display: inline;
}
#color_bar{
  float: left;
  display: inline;
  margin-left: -200px;
  margin-top: 50px;
  
}

</style>
