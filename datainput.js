let start = function(st)
{
    let startbutton;
    let inputgraph;

    st.setup = function()
    {
        st.canvas = st.createCanvas(st.windowWidth, st.windowHeight);
        st.canvas.position(0,0);
        st.background(100,150,190);

        inputgraph = st.createInput("A-B-100,A-C-150,C-D-80,D-B-70,E-D-95,E-C-110");
        inputgraph.size(400, 20);
        inputgraph.position((st.windowWidth-inputgraph.width)/2,180);


        startbutton = st.createButton(" Start ");
        startbutton.position((st.windowWidth-startbutton.width)/2, 250);
        startbutton.mousePressed(st.load);

        st.fill(255, 230, 250);
        st.textAlign(st.CENTER, st.BOTTOM);
        st.textSize(40);
        st.text("DIJKSTRA PATH FINDER", st.windowWidth/2, 80);

        st.textAlign(st.CENTER, st.BOTTOM);
        st.textSize(13);
        st.text("USAGE: A-B-100,A-C-150,C-B-200 \n node-node-distance,node-node-distance, ......", st.windowWidth/2, 120);
    }

    st.load = function()
    {
        let values = inputgraph.value().split(",");
        //console.log(values);
        if(st.dataCheck(values) === true)  // se i valori inseriti sono corretti
        {
            dijObj = new Dijkstra(values);  
            init_variables(dijObj);
            new p5(graph_side);
            new p5(controls_side);
            startscene.remove();
        }
    }

    st.dataCheck = function(values)
    {
        for(let i=0; i<values.length; i++)
        {
            let splittedvalues = values[i].split('-');
            if(splittedvalues.length !== 3)
            {
                st.displayError();
                return false;
            }
            if( splittedvalues[0] === splittedvalues[1] || splittedvalues[0] === "" ||
                splittedvalues[1] === "" || isNaN(parseInt(splittedvalues[2])))
            {
                st.displayError();
                return false;
            }
        }
        return true;
    }

    st.displayError = function()
    {
        st.fill(255, 10, 10);
        st.textAlign(st.CENTER, st.BOTTOM);
        st.textSize(15);
        st.text("ERRORE INSERIMENTO DATI", st.windowWidth/2, 20);
    }
}
let nodes = [];
let dijObj;

let startscene = new p5(start);
