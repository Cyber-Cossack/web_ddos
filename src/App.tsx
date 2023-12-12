import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";
import { startDdos, stopDdos } from "./utils/ddos";
import { TypeDDOSObject, fetchStatus } from "./types/defaultTypes";
import { Slider } from "@/components/ui/slider"

function App() 
{
    const [isDdos, setDdos] = useState<TypeDDOSObject>({status: false});
    const [fetchStatusState, changeFetchStatusState] = useState<fetchStatus>({goodFetch: 0, badFetch: 0, allFetch: 0});
    const [attackSpeed, setAttackSpeed] = useState<number[]>([10]);

    const start = async () =>
    {
        const getRusniavieSites = await (await fetch("targets/links.json")).json()
        setDdos({status: true, workers: startDdos(getRusniavieSites, changeFetchStatusState, attackSpeed[0])});
    }

    const stop = () =>
    {
        stopDdos(isDdos.workers)
        setDdos({status: false});
    }

    return (
    <>
        <div className="flex h-screen justify-center items-center">
            <Card className="max-w-[350px] w-[100%]">
                <CardHeader>
                    <CardTitle>Почати WebDDOS</CardTitle>
                    <CardDescription>Розпочинайте атаку, по свинособакам</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="w-full flex justify-center">
                        <div className="flex gap-y-2 flex-col">
                            <div className="flex justify-between flex-row gap-x-2">
                                <div>
                                    Успішно: {fetchStatusState.goodFetch}
                                </div>
                                <div>
                                    Помилка: {fetchStatusState.badFetch}
                                </div>
                            </div>
                            <div className="text-center">
                                Всього запитів: {fetchStatusState.allFetch}
                            </div>
                        </div>
                    </div>
                    <div className={`my-3 ${isDdos.status ? 'hidden' : 'block'}`}>
                        <p className='text-center mb-2 text-base font-medium'>Швидкість атаки:</p>
                        <div className="px-6">
                            <Slider min={5} defaultValue={[10]} onValueChange={setAttackSpeed} max={100} step={1} />
                            <p className="text-center mt-1 text-sm text-[#bababa]">ваша швидкість - {attackSpeed} ms</p>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button disabled={isDdos.status} className={`max-w-[125px] w-[100%]`} variant={isDdos.status ? `outline` : `default`} onClick={start}>Почати атаку</Button>
                    <Button disabled={!isDdos.status} className={`max-w-[125px] w-[100%] ${isDdos.status ? `cursor-pointer` : `cursor-default`}`} variant={isDdos.status ? `default` : `outline`} onClick={stop}>Зупинити</Button>
                </CardFooter>
            </Card>
        </div>
    </>
    )
}

export default App
