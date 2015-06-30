<!-- Copyright 2014 Tianchuang & Sunchao -->

var width = 1200;
var height = 750;
var img_w = 80;
var img_h = 80;

var svg = d3.select("body").append("svg")
    .attr("width",width)
    .attr("height",height);

svg.mingSelectionId = "ming";
svg.mingSVG = 0 ;


d3.json("data/sanguozhi11.json",function(error,root){

    if( error ){
        return console.log(error);
    }
    console.log(root);

    var force = d3.layout.force()
        .nodes(root.nodes)
        .links(root.edges)
        .size([width,height])
        .linkDistance(250)
        .charge(-1500)
        .start();


    //义兄弟关系
    var edges_line = svg.selectAll("line")
        .data(root.edges)
        .enter()
        .append("line")
        .style("stroke","#339966")
        .style("opacity",0.6)
        .style("stroke-width",function (d) {
        if(d.relation=="义兄弟关系")
            return 3;
            else return 0;
    });

    //亲爱关系
    var edges_line1 = svg.selectAll("line1")
        .data(root.edges)
        .enter()
        .append("line")
        .style("stroke","#FF0033")
        .style("opacity",0.6)
        .style("stroke-width",function (d) {
            if(d.relation=="亲爱关系")
                return 3;
            else return 0;
        });

    //夫妻关系
    var edges_line2 = svg.selectAll("line2")
        .data(root.edges)
        .enter()
        .append("line")
        .style("stroke","#FF3399")
        .style("opacity",0.6)
        .style("stroke-width",function (d) {
            if(d.relation=="夫妻关系")
                return 3;
            else return 0;
        });

    //厌恶关系
    var edges_line3 = svg.selectAll("line3")
        .data(root.edges)
        .enter()
        .append("line")
        .style("stroke","#6600CC")
        .style("opacity",0.6)
        .style("stroke-width",function (d) {
            if(d.relation=="厌恶关系")
                return 3;
            else return 0;
        });

    //血缘关系
    var edges_line4 = svg.selectAll("line4")
        .data(root.edges)
        .enter()
        .append("line")
        .style("stroke","#FF9900")
        .style("opacity",0.6)
        .style("stroke-width",function (d) {
            if(d.relation=="血缘关系")
                return 3;
            else return 0;
        });


    var edges_text = svg.selectAll(".linetext")
        .data(root.edges)
        .enter()
        .append("text")
        .attr("class","linetext")
        .text(function(d){
            return d.relation;
        });

    stylename_text = svg.selectAll(".nodetext4")
        .data(root.nodes)
        .enter()
        .append("text")
        .attr("class", "nodetext4")

        .text(function (d) {
            return  "字：" +d.style_name;
        });

    var nodes_img = svg.selectAll("image")
        .data(root.nodes)
        .enter()
        .append("image")
        .attr("width",img_w )
        .attr("height",img_h)
        .attr("xlink:href",function(d){
            return d.image;
        })
        .on("mouseover",function(d,i){
            //显示连接线上的文字
            edges_text
                .style("fill-opacity",function(edge){
                if( edge.source === d || edge.target === d ){
                    return 1.0;
                }
            });


        })
        .on("mouseout",function(d,i){
            //隐去连接线上的文字
            edges_text.style("fill-opacity",function(edge){
                if( edge.source === d || edge.target === d ){
                    return 0.0;
                }
            });


        })
        .call(force.drag);

    var text_dx = -20;
    var text_dy = 20;

    //蜀国的人物颜色为暗绿色
    var nodes_text;
    nodes_text = svg.selectAll(".nodetext")
        .data(root.nodes)
        .enter()
        .append("text")
        .attr("class","nodetext")
        .attr("dx", text_dx)
        .attr("dy", text_dy)
        .text(function (d) {
            if(d.id<50)
            return d.name+"(蜀国)";
        });


    //魏国的人物颜色为蓝色
    var nodes_text1;
    nodes_text1 = svg.selectAll(".nodetext1")
        .data(root.nodes)
        .enter()
        .append("text")
        .attr("class","nodetext1")
        .attr("dx", text_dx)
        .attr("dy", text_dy)
        .text(function (d) {
            if(d.id>49 && d.id<60)
                return d.name+"(魏国)";
        });

    //吴国的人物颜色为红色
   var nodes_text2;
    nodes_text2 = svg.selectAll(".nodetext2")
        .data(root.nodes)
        .enter()
        .append("text")
        .attr("class","nodetext2")
        .attr("dx", text_dx)
        .attr("dy", text_dy)
        .text(function (d) {
            if(d.id>59 && d.id<70)
                return d.name+"(吴国)";
        });



    //其他势力的人物颜色为灰色
    var nodes_text3;
    nodes_text3 = svg.selectAll(".nodetext3")
        .data(root.nodes)
        .enter()
        .append("text")
        .attr("class","nodetext3")
        .attr("dx", text_dx)
        .attr("dy", text_dy)
        .text(function (d) {
            if(d.id>69)
                return d.name+"(其他势力)";
        });




    force.on("tick", function(){

        //限制结点的边界
        root.nodes.forEach(function(d,i){
            d.x = d.x - img_w/2 < 0     ? img_w/2 : d.x ;
            d.x = d.x + img_w/2 > width ? width - img_w/2 : d.x ;
            d.y = d.y - img_h/2 < 0      ? img_h/2 : d.y ;
            d.y = d.y + img_h/2 + text_dy > height ? height - img_h/2 - text_dy : d.y ;
        });

        //更新各个关系的位置
        edges_line.attr("x1",function(d){ return d.source.x; });
        edges_line.attr("y1",function(d){ return d.source.y; });
        edges_line.attr("x2",function(d){ return d.target.x; });
        edges_line.attr("y2",function(d){ return d.target.y; });

        edges_line1.attr("x1",function(d){ return d.source.x; });
        edges_line1.attr("y1",function(d){ return d.source.y; });
        edges_line1.attr("x2",function(d){ return d.target.x; });
        edges_line1.attr("y2",function(d){ return d.target.y; });

        edges_line2.attr("x1",function(d){ return d.source.x; });
        edges_line2.attr("y1",function(d){ return d.source.y; });
        edges_line2.attr("x2",function(d){ return d.target.x; });
        edges_line2.attr("y2",function(d){ return d.target.y; });

        edges_line3.attr("x1",function(d){ return d.source.x; });
        edges_line3.attr("y1",function(d){ return d.source.y; });
        edges_line3.attr("x2",function(d){ return d.target.x; });
        edges_line3.attr("y2",function(d){ return d.target.y; });

        edges_line4.attr("x1",function(d){ return d.source.x; });
        edges_line4.attr("y1",function(d){ return d.source.y; });
        edges_line4.attr("x2",function(d){ return d.target.x; });
        edges_line4.attr("y2",function(d){ return d.target.y; });


        //更新连接线上文字的位置
        edges_text.attr("x",function(d){ return (d.source.x + d.target.x) / 2 ; });
        edges_text.attr("y",function(d){ return (d.source.y + d.target.y) / 2 ; });



        //更新结点图片
        nodes_img.attr("x",function(d){ return d.x - img_w/2; });
        nodes_img.attr("y",function(d){ return d.y - img_h/2; });

        //蜀国人物的文字
        nodes_text.attr("x",function(d){ return d.x - img_w/6});
        nodes_text.attr("y",function(d){ return d.y + img_w/2; });

        //魏国人物的文字
        nodes_text1.attr("x",function(d){ return d.x - img_w/6});
        nodes_text1.attr("y",function(d){ return d.y + img_w/2; });

        //吴国人物的文字
        nodes_text2.attr("x",function(d){ return d.x - img_w/6});
        nodes_text2.attr("y",function(d){ return d.y + img_w/2; });

        //其他势力人物的文字
        nodes_text3.attr("x",function(d){ return d.x - img_w/3});
        nodes_text3.attr("y",function(d){ return d.y + img_w/2; });


        //更新 字 的位置

        stylename_text.attr("x",function(d){ return d.x- img_w/3 });
        stylename_text.attr("y",function(d){ return d.y- img_h-5+ img_w/2; });

    });






});







function refreshZi(){
     selectList = document.getElementById(svg.mingSelectionId);
     selectedValue = selectList.options[selectList.selectedIndex].getAttribute("value");
     svg.mingSVG =  selectedValue;

    if(svg.mingSVG==1)
    {
        //显示 字
        stylename_text
            .style("fill-opacity",function() {

                return 1.0;

            });

        }else{
     //隐藏 字
        stylename_text
            .style("fill-opacity",function() {
                return 0.0;
                });
    }



}



