export default function Loader(isLoading : boolean, loading_text: string) {
    return (
        <>
        {isLoading &&<div className="absolute w-[90vw] h-[90vh]">
            <p>{loading_text}</p>
            </div>}
            </>
    )
}