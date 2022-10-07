
class Dijkstra
{
    constructor(roads)
    {
        this.roads = roads;
        this.graph = this.MappingRoads();
    }

    MappingRoads()
    {
        // crea associazioni tra i nodi
        let from, to, dis;
        let reachableRoadsFrom = {};
        this.roads.forEach(el => {
            [from, to, dis] = el.split("-");
            if(reachableRoadsFrom[from] == null)    // se non è presente la property
                reachableRoadsFrom[from] = [];      // aggiunge la property per ogni punto "a sinistra (from)"

            if(reachableRoadsFrom[to] == null)      // se non è presente la property
                reachableRoadsFrom[to] = [];        // aggiunge la property per ogni punto "a destra (to)"

            reachableRoadsFrom[from].push([to, dis]);  // inserisce il nodo <to> e la distanza, nell'array dei nodi raggiungibili dal nodo from
            reachableRoadsFrom[to].push([from, dis]);  // e viceversa per il nodo <to> (es. RecFrom[A] = [B] ; RecFrom[B] = [A])
        });
        return reachableRoadsFrom;
    }

    FindRoutes(start, dest)
    {   
        // trova tutti i percorsi minimi tra un nodo start ed un altro nodo dest
        // se dest è specificato restituisce il percorso tra start e dest

        let distance = {};          // oggetto per contenere le distanze minime dal punto di partenza ad ogni altro nodo
        let previous = {};          // oggetto per contenere i nodi precedenti del percorso
        let Q = []                  // insieme dei nodi del grafo
        for (let vert in this.graph)     // per ogni vertice del grafo: "A" , "B" , "C" ...
        {
            distance[vert] = Number.POSITIVE_INFINITY;       // inzializza la distanza per ogni vertice a infinito
            previous[vert] = null;         // inzializza il nodo precedente di ogni vertice a null
            Q.push(vert);                  // aggiunge il vertice nell'array di tutti i vertici
        }
        distance[start] = 0;  // distanza del punto inziale impostata a 0 
        
        while(Q.length > 0)
        {     
            let u = minDist(Q);         // vertice con la minore distanza in distance[]
            Q.splice(Q.indexOf(u),1);   // rimozione vertice u da Q    

            this.graph[u].forEach(vertex => {        // vertex[0] = vertice (A,B...) ; vertex[1] = distanza
                if(Q.includes(vertex[0]))        // se il vertice non è incluso in Q allora è stato già "processato"
                {
                    let alt = distance[u] + parseInt(vertex[1], 10);  // alt distanza alternativa data dalla somma della distanza da start a u  +  distanza da u al nodo vertex

                    if(alt < distance[vertex[0]])    // se alt è minore della distanza presente in distance[vertex]
                    {
                        distance[vertex[0]] = alt; 
                        previous[vertex[0]] = u; 
                    }
                }
            });
        }

        if(dest === undefined)
        {
            return [distance, previous]; 
        }
        else
        {
            let path = [];
            let currentNode = dest;
            while(currentNode !== null)
            {
                path.unshift(currentNode);
                currentNode = previous[currentNode];
            }
            if(path[0] === start)
                return path;
            else
                return `Nodo ${dest} Irraggiungibile da ${start} !`;
        }

        function minDist(Q)
        {
            //restituisce il vertice di Q, con la minore distanza
            let pos = 0;
            let min = distance[Q[pos]];
            for(let i=1; i<Q.length; i++)
            {
                if(distance[Q[i]] < min)
                {
                    min = distance[Q[i]];
                    pos = i;
                }
            }
            return Q[pos];
        }
    }
}


// const sample_nodes = ["A-B-50","A-C-75", "A-D-90", "B-E-100", "B-C-75","E-C-45", "E-D-65", "D-C-80"];

// let dijkstra = new Dijkstra(sample_nodes);
// console.log(dijkstra.graph);

// let perc = dijkstra.FindRoutes("A", "E");
// console.log(perc);

// let distances = dijkstra.FindRoutes("A")[0];
// let route = dijkstra.FindRoutes("A")[1];
// console.log(distances);
// console.log(route);

