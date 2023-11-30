"use client"
import { CookieHandler } from "~/utils/cookie_handler";
import { api } from "~/utils/api";
import {useEffect} from "react"
interface FormData{

}
export default function Workout() {
    const cookie_handler = new CookieHandler;
    const use
    const data = api.post.get_exercises.useQuery({username:})
    useEffect(() => {
        const cookie: string | boolean = cookie_handler.checkForCookie('user')
        if (!cookie) {
            window.location.href = "/login"
            return //! very important
        }
    },[])
    return (
        <div>
            <form>
                <input/>
            </form>
        </div>
    )
}