<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

import { getSentence, getKey } from "@/api/home";

import TypeWriter from "@/components/TypeWriter/type-writer";

const router = useRouter();
const saying = ref([]);
var WINDOW_WIDTH = document.body.offsetWidth;
var WINDOW_HEIGHT = document.body.offsetHeight;
var canvas,context;
var num = 500;
var stars = [];
// eslint-disable-next-line no-unused-vars
var mouseX = WINDOW_WIDTH/2;
// eslint-disable-next-line no-unused-vars
var mouseY = WINDOW_HEIGHT/2;
var rnd;
const menuList = [
  {
    label: "首页",
    path: "/home",
  },
  {
    label: "相册",
    path: "/photoAlbum",
  },
  {
    label: "说说",
    path: "/talk",
  },
  {
    label: "留言",
    path: "/message/list",
  },
  {
    label: "友链",
    path: "/link/list",
  },
];
function liuxing(){
		var time = Math.round(Math.random()*3000+33);
		setTimeout(function(){
			rnd = Math.ceil(Math.random()*stars.length)
			liuxing();
		},time)
	}

	function mouseMove(e){
		//因为是整屏背景，这里不做坐标转换
		mouseX = e.clientX;
		mouseY = e.clientY;
	}

	function render(){
		context.fillStyle = 'rgba(0,0,0,0.1)';
		context.fillRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
		// context.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT)
		for(var i =0; i<num ; i++){
			var star = stars[i];
			if(i == rnd){
				star.vx = -5;
				star.vy = 20;
				context.beginPath();
				context.strokeStyle = 'rgba(255,255,255,'+star.alpha+')';
				context.lineWidth = star.r;
				context.moveTo(star.x,star.y);
				context.lineTo(star.x+star.vx,star.y+star.vy);
				context.stroke();
				context.closePath();
			}
			star.alpha += star.ra;
			if(star.alpha<=0){
				star.alpha = 0;
				star.ra = -star.ra;
				star.vx = Math.random()*0.2-0.1;
				star.vy = Math.random()*0.2-0.1;
			}else if(star.alpha>1){
				star.alpha = 1;
				star.ra = -star.ra
			}
			star.x += star.vx;
			if(star.x>=WINDOW_WIDTH){
				star.x = 0;
			}else if(star.x<0){
				star.x = WINDOW_WIDTH;
				star.vx = Math.random()*0.2-0.1;
				star.vy = Math.random()*0.2-0.1;
			}
			star.y += star.vy;
			if(star.y>=WINDOW_HEIGHT){
				star.y = 0;
				star.vy = Math.random()*0.2-0.1;
				star.vx = Math.random()*0.2-0.1;
			}else if(star.y<0){
				star.y = WINDOW_HEIGHT;
			}
			context.beginPath();
			var bg = context.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r);
			bg.addColorStop(0,'rgba(255,255,255,'+star.alpha+')')
			bg.addColorStop(1,'rgba(255,255,255,0)')
			context.fillStyle  = bg;
			context.arc(star.x,star.y, star.r, 0, Math.PI*2, true);
			context.fill();
			context.closePath();
		}
	}

	function addStar(){
		for(var i = 0; i<num ; i++){
			var aStar = {
				x:Math.round(Math.random()*WINDOW_WIDTH),
				y:Math.round(Math.random()*WINDOW_HEIGHT),
				r:Math.random()*3,
				ra:Math.random()*0.05,
				alpha:Math.random(),
				vx:Math.random()*0.2-0.1,
				vy:Math.random()*0.2-0.1
			}
			stars.push(aStar);
		}
	}
  const initBg = () =>{
   

    canvas = document.getElementById('canvas');
		canvas.width = WINDOW_WIDTH;
		canvas.height = WINDOW_HEIGHT;

		context = canvas.getContext('2d');

		addStar();
		setInterval(render,33);
		liuxing();

		// render();
		document.body.addEventListener('mousemove',mouseMove);
  }
// const initBg = () => {
//   const canvas = document.getElementById("canvas");
//   if (!canvas) return;
//   var num = 120;
//   var w = window.innerWidth;
//   var h = window.innerHeight;
//   var _x = 0;
//   var _y = 0;
//   var _z = 150;
//   var dtr = function (d) {
//     return (d * Math.PI) / 180;
//   };
//   var rnd = function () {
//     return Math.sin((Math.floor(Math.random() * 360) * Math.PI) / 180);
//   };

//   var cam = {
//     obj: {
//       x: _x,
//       y: _y,
//       z: _z,
//     },
//     dest: {
//       x: 0,
//       y: 0,
//       z: 1,
//     },
//     dist: {
//       x: 0,
//       y: 0,
//       z: 200,
//     },
//     ang: {
//       cplane: 0,
//       splane: 0,
//       ctheta: 0,
//       stheta: 0,
//     },
//     zoom: 1,
//     disp: {
//       x: w / 2,
//       y: h / 2,
//       z: 0,
//     },
//     upd: function () {
//       cam.dist.x = cam.dest.x - cam.obj.x;
//       cam.dist.y = cam.dest.y - cam.obj.y;
//       cam.dist.z = cam.dest.z - cam.obj.z;
//       cam.ang.cplane = -cam.dist.z / Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.z * cam.dist.z);
//       cam.ang.splane = cam.dist.x / Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.z * cam.dist.z);
//       cam.ang.ctheta =
//         Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.z * cam.dist.z) /
//         Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.y * cam.dist.y + cam.dist.z * cam.dist.z);
//       cam.ang.stheta =
//         -cam.dist.y /
//         Math.sqrt(cam.dist.x * cam.dist.x + cam.dist.y * cam.dist.y + cam.dist.z * cam.dist.z);
//     },
//   };
//   var trans = {
//     parts: {
//       sz: function (p, sz) {
//         return {
//           x: p.x * sz.x,
//           y: p.y * sz.y,
//           z: p.z * sz.z,
//         };
//       },
//       rot: {
//         x: function (p, rot) {
//           return {
//             x: p.x,
//             y: p.y * Math.cos(dtr(rot.x)) - p.z * Math.sin(dtr(rot.x)),
//             z: p.y * Math.sin(dtr(rot.x)) + p.z * Math.cos(dtr(rot.x)),
//           };
//         },
//         y: function (p, rot) {
//           return {
//             x: p.x * Math.cos(dtr(rot.y)) + p.z * Math.sin(dtr(rot.y)),
//             y: p.y,
//             z: -p.x * Math.sin(dtr(rot.y)) + p.z * Math.cos(dtr(rot.y)),
//           };
//         },
//         z: function (p, rot) {
//           return {
//             x: p.x * Math.cos(dtr(rot.z)) - p.y * Math.sin(dtr(rot.z)),
//             y: p.x * Math.sin(dtr(rot.z)) + p.y * Math.cos(dtr(rot.z)),
//             z: p.z,
//           };
//         },
//       },
//       pos: function (p, pos) {
//         return {
//           x: p.x + pos.x,
//           y: p.y + pos.y,
//           z: p.z + pos.z,
//         };
//       },
//     },
//     pov: {
//       plane: function (p) {
//         return {
//           x: p.x * cam.ang.cplane + p.z * cam.ang.splane,
//           y: p.y,
//           z: p.x * -cam.ang.splane + p.z * cam.ang.cplane,
//         };
//       },
//       theta: function (p) {
//         return {
//           x: p.x,
//           y: p.y * cam.ang.ctheta - p.z * cam.ang.stheta,
//           z: p.y * cam.ang.stheta + p.z * cam.ang.ctheta,
//         };
//       },
//       set: function (p) {
//         return {
//           x: p.x - cam.obj.x,
//           y: p.y - cam.obj.y,
//           z: p.z - cam.obj.z,
//         };
//       },
//     },
//     persp: function (p) {
//       return {
//         x: ((p.x * cam.dist.z) / p.z) * cam.zoom,
//         y: ((p.y * cam.dist.z) / p.z) * cam.zoom,
//         z: p.z * cam.zoom,
//         p: cam.dist.z / p.z,
//       };
//     },
//     disp: function (p, disp) {
//       return {
//         x: p.x + disp.x,
//         y: -p.y + disp.y,
//         z: p.z + disp.z,
//         p: p.p,
//       };
//     },
//     steps: function (_obj_, sz, rot, pos, disp) {
//       var _args = trans.parts.sz(_obj_, sz);
//       _args = trans.parts.rot.x(_args, rot);
//       _args = trans.parts.rot.y(_args, rot);
//       _args = trans.parts.rot.z(_args, rot);
//       _args = trans.parts.pos(_args, pos);
//       _args = trans.pov.plane(_args);
//       _args = trans.pov.theta(_args);
//       _args = trans.pov.set(_args);
//       _args = trans.persp(_args);
//       _args = trans.disp(_args, disp);
//       return _args;
//     },
//   };
//   (function () {
//     "use strict";
//     var threeD = function (param) {
//       this.transIn = {};
//       this.transOut = {};
//       this.transIn.vtx = param.vtx;
//       this.transIn.sz = param.sz;
//       this.transIn.rot = param.rot;
//       this.transIn.pos = param.pos;
//     };
//     threeD.prototype.vupd = function () {
//       this.transOut = trans.steps(
//         this.transIn.vtx,
//         this.transIn.sz,
//         this.transIn.rot,
//         this.transIn.pos,
//         cam.disp
//       );
//     };
//     var Build = function () {
//       this.vel = 0.04;
//       this.lim = 360;
//       this.diff = 200;
//       this.initPos = 100;
//       this.toX = _x;
//       this.toY = _y;
//       this.go();
//     };
//     Build.prototype.go = function () {
//       this.canvas = document.getElementById("canvas");
//       this.canvas.width = window.innerWidth;
//       this.canvas.height = window.innerHeight;
//       this.$ = canvas.getContext("2d");
//       this.$.globalCompositeOperation = "source-over";
//       this.varr = [];
//       this.dist = [];
//       this.calc = [];
//       for (var i = 0, len = num; i < len; i++) {
//         this.add();
//       }
//       this.rotObj = {
//         x: 0,
//         y: 0,
//         z: 0,
//       };
//       this.objSz = {
//         x: w / 5,
//         y: h / 5,
//         z: w / 5,
//       };
//     };
//     Build.prototype.add = function () {
//       this.varr.push(
//         new threeD({
//           vtx: {
//             x: rnd(),
//             y: rnd(),
//             z: rnd(),
//           },
//           sz: {
//             x: 0,
//             y: 0,
//             z: 0,
//           },
//           rot: {
//             x: 20,
//             y: -20,
//             z: 0,
//           },
//           pos: {
//             x: this.diff * Math.sin((360 * Math.random() * Math.PI) / 180),
//             y: this.diff * Math.sin((360 * Math.random() * Math.PI) / 180),
//             z: this.diff * Math.sin((360 * Math.random() * Math.PI) / 180),
//           },
//         })
//       );
//       this.calc.push({
//         x: 360 * Math.random(),
//         y: 360 * Math.random(),
//         z: 360 * Math.random(),
//       });
//     };
//     Build.prototype.upd = function () {
//       cam.obj.x += (this.toX - cam.obj.x) * 0.05;
//       cam.obj.y += (this.toY - cam.obj.y) * 0.05;
//     };
//     Build.prototype.draw = function () {
//       this.$.clearRect(0, 0, this.canvas.width, this.canvas.height);
//       cam.upd();
//       this.rotObj.x += 0.1;
//       this.rotObj.y += 0.1;
//       this.rotObj.z += 0.1;
//       for (var i = 0; i < this.varr.length; i++) {
//         for (var val in this.calc[i]) {
//           // eslint-disable-next-line
//           if (this.calc[i].hasOwnProperty(val)) {
//             this.calc[i][val] += this.vel;
//             if (this.calc[i][val] > this.lim) this.calc[i][val] = 0;
//           }
//         }
//         this.varr[i].transIn.pos = {
//           x: this.diff * Math.cos((this.calc[i].x * Math.PI) / 180),
//           y: this.diff * Math.sin((this.calc[i].y * Math.PI) / 180),
//           z: this.diff * Math.sin((this.calc[i].z * Math.PI) / 180),
//         };
//         this.varr[i].transIn.rot = this.rotObj;
//         this.varr[i].transIn.sz = this.objSz;
//         this.varr[i].vupd();
//         if (this.varr[i].transOut.p < 0) continue;
//         var g = this.$.createRadialGradient(
//           this.varr[i].transOut.x,
//           this.varr[i].transOut.y,
//           this.varr[i].transOut.p,
//           this.varr[i].transOut.x,
//           this.varr[i].transOut.y,
//           this.varr[i].transOut.p * 2
//         );
//         this.$.globalCompositeOperation = "lighter";
//         g.addColorStop(0, "hsla(255, 255%, 255%, 1)");
//         g.addColorStop(0.5, "hsla(" + (i + 2) + ",85%, 40%,1)");
//         g.addColorStop(1, "hsla(" + i + ",85%, 40%,.5)");
//         this.$.fillStyle = g;
//         this.$.beginPath();
//         this.$.arc(
//           this.varr[i].transOut.x,
//           this.varr[i].transOut.y,
//           this.varr[i].transOut.p * 2,
//           0,
//           Math.PI * 2,
//           false
//         );
//         this.$.fill();
//         this.$.closePath();
//       }
//     };
//     Build.prototype.anim = function () {
//       window.requestAnimationFrame = (function () {
//         return (
//           window.requestAnimationFrame ||
//           // eslint-disable-next-line
//           function (callback, _element) {
//             window.setTimeout(callback, 1000 / 60);
//           }
//         );
//       })();
//       var anim = function () {
//         this.upd();
//         this.draw();
//         window.requestAnimationFrame(anim);
//       }.bind(this);
//       window.requestAnimationFrame(anim);
//     };
//     Build.prototype.run = function () {
//       this.anim();
//       window.addEventListener(
//         "mousemove",
//         function (e) {
//           if (this.canvas) {
//             this.toX = (e.clientX - this.canvas.width / 2) * -0.8;
//             this.toY = (e.clientY - this.canvas.height / 2) * 0.8;
//           }
//         }.bind(this)
//       );
//       window.addEventListener(
//         "touchmove",
//         function (e) {
//           if (this.canvas) {
//             e.preventDefault();
//             this.toX = (e.touches[0].clientX - this.canvas.width / 2) * -0.8;
//             this.toY = (e.touches[0].clientY - this.canvas.height / 2) * 0.8;
//           }
//         }.bind(this)
//       );
//     };
//     var app = new Build();
//     app.run();
//   })();
//   window.addEventListener(
//     "resize",
//     function () {
//       if (canvas) {
//         canvas.width = w = window.innerWidth;
//         canvas.height = h = window.innerHeight;
//       }
//     },
//     false
//   );
// };
const goMenu = (val) => {
  router.push(val);
};

const getAppKey = async () => {
  let appRes = await getKey();
  try {
    if (appRes.code == 0) {
      let res = await getSentence(appRes.data.cola_key);
      if (res.code == 0) {
        saying.value = [res.data.note];
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    saying.value = [
  "生命如梦，梦醒时方知真实。",
  "勇敢是一场冒险的开始，坚持是成功的终点。",
  "岁月如歌，我们是自己的旋律创作者。",
  "爱是心灵的灯塔，照亮前行的路途。",
  "行走在困境中，才能发现自己的坚韧。",
  "每一次的挫折都是成长的踏板，踏上去吧。",
  "青春是一首美妙的交响曲，我们是乐章的奏者。",
  "相信自己的力量，你就能战胜生活的风雨。",
  "快乐是一种选择，微笑是一种态度。",
  "追逐梦想的路上，每一步都是对未来的信任。"
]
;
  }
};
onMounted(() => {
  initBg();
  getAppKey();
});
</script>

<template>
  <div class="home_bg">
    <canvas id="canvas"></canvas>
    <div class="font">BJ's Blog</div>
    <TypeWriter class="type-writer" :typeList="saying"></TypeWriter>
    <ul class="home-tab">
      <li v-for="item in menuList" :key="item.path" @click="goMenu(item.path)">{{ item.label }}</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.home_bg {
  width: 100%;
  height: 100vh;
  position: relative;
  background: rgba(0, 0, 0, 0.9);
  overflow: hidden;
}
.home-tab {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
  min-height: 3rem;
  padding: 1rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
  flex-wrap: nowrap;
  font-size: 1.6rem;
  color: #fff;
  font-weight: 600;
  margin-bottom: 1rem;
  border-radius: 2rem;
  border: 2px solid #fff;

  li {
    word-break: keep-all;
    margin-right: 1rem;
  }
}
.font {
  position: absolute;
  top: 40%;
  left: 50%;
  font-style: italic;
  transform: translate(-50%, -50%);
  font-size: clamp(2em, 8vmin, 20em);
  text-shadow: 0;
  color: #fff;
  padding: 0.5rem;
  cursor: pointer;
}
.font:hover {
  animation: anime 0.5s cubic-bezier(0.445, 0.05, 0.55, 0.95) alternate forwards;
}

@keyframes anime {
  from {
    font-variation-settings:
      "wght" 300,
      "slnt" 15;
    text-shadow: none;
  }
  to {
    font-variation-settings:
      "wght" 800,
      "slnt" 0;
    text-shadow:
      3px 3px 0px #00e6e6,
      6px 6px 0px #01cccc,
      9px 9px 0px #00bdbd,
      12px 12px 8px #dda121;
  }
}

.type-writer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
