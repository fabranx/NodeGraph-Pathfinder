
/* DICHIARAZIONE VARIABILI */

let nodes_position;   // oggetto contenente tutti i nodi con le proprie coordinate, diametro e stato(drawed)
let draw_lines_status;  // per gestire lo stato delle linee tra nodi (se sono state disegnate o no)
let listOfNodes;  //array contenente i nomi dei nodi - in base a questo array viene stabilito l'ordine in cui vengono disegnati i nodi
let max_iterations;
let path = [];

let cos = 0;
let sin = 0;
let dist = 0;
let currentNode;
let angle = 0;

let controls_canvas_x = 300;
let controls_canvas_y = 400;
let graph_canvas_x = 2000;
let graph_canvas_y = 1000;

let ScaleSlider;  // slider per zoomare il grafo
let RotSlider;  // slider per ruotare il grafo
let input;   // input per inserire coordinate del primo nodo
let button;  // button per cambiare coordinate del primo nodo
let selectFN;  // select per selezionare il primo nodo del grafo da disegnare
let selectStart, selectDest; // select per selezionare il nodo di partenza e nodo di arrivo

/* VARIABILI DI GESTIONE DISEGNO GRAFO */
let rotation = 1;
let scale = 1;
let nodeStartPos = [200, 100];
let initialNode;
let StartNode;
let DestNode;


function init_variables(dijObj)
{
    nodes_position = init_nodes_position(dijObj.graph);
    draw_lines_status = init_lines_nodes(dijObj.graph);
    listOfNodes = Object.keys(nodes_position);
    max_iterations = maxIteration(listOfNodes.length);
    initialNode = listOfNodes[0];
}

function init_nodes_position(graph)
{ 
    /*
     * INIZIALIZZA OGGETTO nodes_coordinate CHE CONTIENE UN OGGETTO PER OGNI NODO DEL GRAFO (cur_node_char)
     * OGNI cur_node_char LE COORDINATE(x,y), IL DIAMETRO (d) E IL FLAG DI STATO (drawed). drawed = true => il nodo è stato mostrato a schermo
     */
    let nodes_coordinate = {};
    for(let cur_node_char in graph)
    {
        nodes_coordinate[cur_node_char] = {
            x: 0,
            y: 0,
            d: 15,
            drawed: false
        }
    }
    return nodes_coordinate;
}

function init_lines_nodes(graph)
{
    /* INIZIALIZZA lines_nodes - OGGETTO CONTENENTE LO STATO DELLE VARIE LINEE TRA I NODI  */
    let lines_nodes = {};
    let neigh = undefined;
    let objOfNeigh = {};  // oggetto contenente i nodi vicini di cur_node_char
    for(cur_node_char in graph)  // per ogni nodo nel grafo
    {
        for(let i=0; i<graph[cur_node_char].length; i++) // per ogni vicino di cur_node_Char
        {            
            neigh = graph[cur_node_char][i][0];  
            objOfNeigh[neigh] = false; 
        }
        lines_nodes[cur_node_char] = objOfNeigh ;
        objOfNeigh = {}; 
    }
    return lines_nodes;
}

function isLineDrawn(node1, node2)
{
    /*
     * RITORNA TRUE SE LA LINEA TRA NODE1 E NODE2 È GIÀ DISEGNATA
     */
    if (draw_lines_status[node1][node2] === undefined)
    {
        console.error("ERRORE");
        return
    }
    if(draw_lines_status[node1][node2] === false && draw_lines_status[node2][node1] === false)
      return false;
    else
      return true;
}


function maxIteration(num)
{
    /* ritorna il numero massimo di iterazioni in base alla lunghezza della lista (num)
    / se il valore del contatore del ciclo supera suddetto numero, significa che alcuni nodi sono irraggiungibili
    /dunque si termina il ciclo e i nodi irragiungibili non vengono mostrati a schermo */
    num--;
    let sum = 1;
    while(num>0)
    {
        sum += num;
        num--;
    }
    return sum;
}

let graph_side = function(gs)
{
    gs.setup = function()
    {
        graph_canvas_x = gs.windowWidth-controls_canvas_x;
        gs.canvas = gs.createCanvas(graph_canvas_x, graph_canvas_y);
        gs.canvas.position(0,0);
    }

    gs.draw = function()
    {
        scale = ScaleSlider.value();
        rotation = RotSlider.value();
        gs.drawGraph();
    }

    gs.drawGraph = function()
    {
        nodes_position = init_nodes_position(dijObj.graph);
        draw_lines_status = init_lines_nodes(dijObj.graph);
        gs.background(250);

        listOfNodes = Object.keys(nodes_position);
        for(let i=0; i<listOfNodes.length && i<=max_iterations;i++) 
        {
            let cur_node_char = listOfNodes[i] 
            currentNode = nodes_position[cur_node_char];  // per ogni nodo currentNode
            if(currentNode.drawed === false && initialNode === cur_node_char)  // se currentNode non è stato disegnato ed è il nodo iniziale
            {
                currentNode.x = nodeStartPos[0];  // assegna le coordinate di partenza a currentNode
                currentNode.y = nodeStartPos[1];
            }

            else if(currentNode.drawed === false)  // se il nodo non è stato disegnato
            {
                listOfNodes.push(cur_node_char);  // AGGIUNGE IL NODO CORRENTE IN FONDO ALLA LISTA IN MODO TALE CHE VENGA DISEGNATO DA UN SUO VICINO
                continue;
            }
        
            for(let i=0; i<dijObj.graph[cur_node_char].length; i++)  // per ogni nodo "vicino" di currentNode
            {
                neigh_node_char = dijObj.graph[cur_node_char][i][0];  // nome del nodo ("A" , "B" ...)
                neighbour = nodes_position[neigh_node_char];  // nodo vicino

                if(neighbour.drawed === true)  // se il nodo vicino è stato già disegnato
                {
                    if(!isLineDrawn(cur_node_char, neigh_node_char))  // se la linea non è stata disegnata (false), disegnala
                    {
                        dist = parseInt(dijObj.graph[cur_node_char][i][1])*scale;  // distanza
                        angle = Math.atan((neighbour.y-currentNode.y) / (neighbour.x-currentNode.x));
                        gs.drawLine(currentNode, neighbour, dist, angle, cur_node_char, neigh_node_char);
                        gs.drawCircle(neighbour, neigh_node_char);
                    }
                    continue;  // prosegui con il ciclo
                }

                n_neighbour =  dijObj.graph[cur_node_char].length;  // numero dei vicini
                if(i === 0)
                    angle = 0.1 * rotation;
                else
                    angle = ((Math.PI/2) / (n_neighbour)) * i * rotation;

                cos = Math.cos(angle);
                sin = Math.sin(angle);
                dist = parseInt(dijObj.graph[cur_node_char][i][1])*scale;  //distanza tra currentNode e i nodi vicini

                neighbour.x = currentNode.x + cos * dist; 
                neighbour.y = currentNode.y + sin * dist;
                gs.drawLine(currentNode, neighbour, dist, angle, cur_node_char, neigh_node_char);
                gs.drawCircle(neighbour, neigh_node_char);

                neighbour.drawed = true;  // imposta questo nodo come disegnato
            }
            gs.drawCircle(currentNode, cur_node_char);  // disegna il nodo currentNode
            currentNode.drawed = true;  // imposta currentNode come disegnato
        }
    }

    gs.drawCircle = function(objectNode, nodeName)
    {
        gs.push();
        if(nodeName === StartNode)  // colore nodo iniziale
        {
            gs.fill(150,255,150); //GREEN
        }
        else if(nodeName === DestNode)  // colore nodo finale
        {
            gs.fill(150,150,255); //PURPLE
        }
        else if(path.includes(nodeName))  // colore nodi del percorso
        {
            gs.fill(255,150,150); //ORANGE
        }
        gs.circle(objectNode.x,objectNode.y, objectNode.d*scale);
        gs.pop();
        gs.textAlign(gs.CENTER, gs.CENTER);
        gs.textSize(5*scale)
        gs.text(nodeName, objectNode.x, objectNode.y);
    }

    gs.drawLine = function(objectNodeFrom, objectNodeTo, dist=undefined, angle =undefined, nodename1, nodename2)
    {
        // disegna la linea
        gs.line(objectNodeFrom.x, objectNodeFrom.y,objectNodeTo.x, objectNodeTo.y);
        if(dist !== undefined)
        {
            // calcola coordinate del punto medio del segmento tra i due nodi
            let middlePointX = (objectNodeFrom.x + objectNodeTo.x) / 2 ;
            let middlePointY = (objectNodeFrom.y + objectNodeTo.y) / 2 ;

            // disegna la distanza ruotata rispetto alla linea
            gs.push();
            gs.textSize(5*scale);
            gs.textAlign(gs.CENTER,gs.BOTTOM);
            gs.translate(middlePointX, middlePointY);
            gs.rotate(angle);
            gs.text(dist/scale, 0, 0);
            gs.pop();

            if(nodename1 !== undefined && nodename2 !== undefined)
            {
                draw_lines_status[nodename1][nodename2] = true;  // imposta a true lo stato di linea disegnata dal nodo "nodename1" al "nodename2"
                draw_lines_status[nodename2][nodename1] = true;  // e viceversa da "nodename2" a "nodename1"  
            }   
        } 
    }
}

let controls_side = function(cs)
{
    cs.setup = function()
    {
        cs.canvas = cs.createCanvas(controls_canvas_x, controls_canvas_y);  // canvas graph
        cs.canvas.position(graph_canvas_x, 10);
        cs.background(180);

        let margin = 50;
        //// Scale Slider
        ScaleSlider = cs.createSlider(1, 5, 1, 0.5);
        ScaleSlider.position(graph_canvas_x+10, margin);
        cs.textSize(20);
        cs.text("SCALE", 10, margin-20);

        //// Rotation Slider
        RotSlider = cs.createSlider(1, 10, 0, 0.1);
        RotSlider.position(graph_canvas_x+10, margin+=60);
        cs.textSize(20);
        cs.text("ROTATION", 10, margin-20);

        //// Coordinate del primo nodo
        input = cs.createInput(`${nodeStartPos[0]}-${nodeStartPos[1]}`);
        input.position(graph_canvas_x+10,margin+=60);
        button = cs.createButton("submit");
        button.position(input.x + input.width, margin);
        button.mousePressed(cs.changeCoord);
        cs.text("FIRST NODE POSITION", 10, margin-20);

        //// Seleziona primo nodo
        selectFN = cs.createSelect();
        selectFN.position(graph_canvas_x+10, margin+=60);
        cs.text("SELECT FIRST NODE", 10, margin-20);
        cs.addNodetoSelect(selectFN);
        selectFN.changed(cs.changeFN);

        //// Seleziona nodo di partenza
        selectStart = cs.createSelect();
        selectStart.position(graph_canvas_x+10, margin+=60);
        cs.text("START", 10, margin-20);
        cs.addNodetoSelect(selectStart);
        selectStart.changed(cs.setPath);

        //// Seleziona nodo di destinazione
        selectDest = cs.createSelect();
        selectDest.position(graph_canvas_x+100, margin);
        cs.text("DEST", 100, margin-20);
        cs.addNodetoSelect(selectDest);
        selectDest.changed(cs.setPath);
    }

    cs.draw = function(){ }

    cs.addNodetoSelect = function(select)
    {
        for(let i=0; i<listOfNodes.length; i++)
        {
            select.option(listOfNodes[i]);  // aggiunge alla select i nodi del grafo
        }
    }

    cs.changeCoord = function()
    {
        // funzione per cambiare coordinate del nodo iniziale
        let coord = input.value().split("-");
        let x_coord = parseInt(coord[0]);
        let y_coord = parseInt(coord[1]);

        if(!isNaN(x_coord) && !isNaN(y_coord))
            nodeStartPos = [x_coord, y_coord];
    }

    cs.changeFN = function()
    {
        // cambia il primo nodo nella visualizzazione
        initialNode = selectFN.value();
    }

    cs.setPath = function()
    {
        StartNode = selectStart.value();
        DestNode = selectDest.value();
        path = dijObj.FindRoutes(StartNode,DestNode);
        console.log(path);
    }
}