export type TypeDDOSObject = 
{
    status: boolean,
    workers?: Worker[]
}

export type fetchStatus =
{
    goodFetch: number,
    badFetch: number,
    allFetch: number
}