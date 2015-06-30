/** Apache License 2.0 Applies for Scripts here, see NOTICE and LICENSE **/
/** @author Sun Sibai & Liu Yu & Tian Chuang & Zhuo Junbao & Zhai Aonan **/

/** SWmatcher, parallel search **/
/**  dependency: kernel/swnodes.js **/
/**  dependency: kernel/swparse.js **/
/**  dependency: kernel/swmatch.js **/
/**  dependency: model/swmodel.js **/
Model.SWmatcher=function(graph,content,strategy) {
 content=content||''; // for Chrome compatibility (only Firefox supports default parameter feature)
 strategy=strategy||{"start":"last","final":"first"}; // default: irreducible matches
 this.title="SWmatcher";
 this.content=content;
 this.ENFAmatcher=new ENFAmatcher(graph,content,strategy);
};
Model.SWmatcher.prototype = {
 reset:function() {this.ENFAmatcher.reset();},
 clean:function() {this.ENFAmatcher.clean();},

 snapshot:function() { // return snapshot of current Graph
  var ret={};
  ret["initial"]=this.ENFAbuilder.graph.entry.idx;
  ret["accept"]=this.ENFAbuilder.graph.final;
  ret["states"]={};
  var nodes=this.ENFAbuilder.graph.nodes;
  var tmp,lkl; // node, link list
  for (it in nodes) {
   tmp={"transit":{}};lkl=nodes[it].lkt;
   for (it2 in lkl) {
    if (lkl[it2][1]) {
     if (!tmp["transit"][lkl[it2][1]]) {tmp["transit"][lkl[it2][1]]={};}
     tmp["transit"][lkl[it2][1]][lkl[it2][0].idx]=0; // set structure: replace 'true' with '0'
    } else { // undefined => ""
     if (!tmp["transit"][""]) {tmp["transit"][""]={};}
     tmp["transit"][""][lkl[it2][0].idx]=0; // set structure: replace 'true' with '0'
    }
   }
   ret["states"][nodes[it].idx]=tmp;
  }
  return [ret];
 },

 aux_addPrefix:function(graph,char) { // modify id tags to avoid ID conflict
  var ret={};
  ret.initial=char+graph.initial;
  ret.accept=[];
  for (it in graph.accept) {ret.accept.push(char+graph.accept[it]);}
  ret.states={};
  var tmpnode,tmpchar;
  for (it1 in graph.states) {
   tmpnode={'phase':graph.states[it1].phase,'transit':{}};
   for (it2 in graph.states[it1].transit) {
    tmpchar={};
    for (it3 in graph.states[it1].transit[it2]) {
     tmpchar[char+it3]=graph.states[it1].transit[it2][it3];
    }
    tmpnode.transit[it2]=tmpchar;
   }
   ret.states[char+it1]=tmpnode;
  }
  return ret;
 },
 highdump:function(mark) { // return snapshot with bracket info highlighted
  mark=mark||false;
  var ret=mark?this.ENFAmatcher.dumpsort(true):this.ENFAmatcher.dump(true); // mark:sort ID, true:show mapping
  var map=ret.mapping;
  ret=ret.graph;
  var hgh=this.ENFAmatcher.high(); // highlight
console.log(hgh);
  var tmp,lkl; // node, link list
  for (it in ret.nodes) {
   tmp=ret.nodes[it];lkl=ret.nodes[it].lkt;tmp["phase"]=hgh[it]?((ret.final.indexOf(it)!=-1)?2:1):0;
   for (it1 in lkl) {
    lkl[it1]
   }
  }
  return [Model.graph2dict(ret,true)]; // phase on
 },

 hightext:function() { // return text with highlighted positions
  var ret=[];
  var pos=this.ENFAmatcher.pos;
  var ctt=this.ENFAmatcher.ctt;
  if (pos>0&&ctt.length>0) {ret.push({"txt":ctt.substr(0,pos),"phase":0});}
  if (ctt.length>0) {ret.push({"txt":ctt[pos],"phase":1});}
  if (ctt.length>0&&pos<ctt.length-1) {ret.push({"txt":ctt.substr(pos+1),"phase":0});}
  return ret;
 },

 step:function() { // iter
  return this.ENFAmatcher.step();
 },

 is_end:function() { // fully evolved or not
  return this.ENFAmatcher.is_end();
 },

 run:function() { // keep stepping until end
  this.ENFAmatcher.run();
  return this.snapshot();
 },

 result:function() { // return matched results
  return this.ENFAmatcher.result();
 },

 refresh:function() { // reset all
  this.reset();
 },

 setStrategy:function(strategy) { // set strategy
  this.strategy=strategy;
  this.reset();
 },

 setContent:function(content) { // new content
  if (this.content!=content) {this.content=content;this.reset();}
 }
};
