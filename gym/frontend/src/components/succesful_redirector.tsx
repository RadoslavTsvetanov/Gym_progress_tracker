import {CookieHandler} from "~/utils/cookie_handler"
import { useEffect } from "react";
export default function Redirector(text: string) {
    const cookie_handler = new CookieHandler();
    return (
        <div>
            {text}
            Redirecting ...
            {        cookie_handler.redirectToLoginIfNoCookie(false,"/")}
        </div>
    )
}