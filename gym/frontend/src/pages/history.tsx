"use client"
import Head from "next/head";
import Link from "next/link";
import { CookieHandler } from "~/utils/cookie_handler";
import { api } from "~/utils/api";
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { User,Exercise, Workout, Program } from "~/utils/types"
import { application_url } from "./constant_variables/constants"
import { Helper_functions } from "~/utils/helper_functions";
export default function History() {
    const cookie_helper = new CookieHandler;
    const [user,set_user] = useState<User | undefined>()
    const progress: object | undefined = api.post.get_progression.useQuery((user != undefined ? {username:user.username,token:user.token}:{}),{enabled:user != undefined})
    useEffect(() => {
        set_user(cookie_helper.extract_cookie('user')) //! ran in useEffect cuz it needs the component to be rendered to have access to the window 
    },[])
    return (
        <>
        {(progress != undefined && user != undefined) ? ( <div>
            <p>{console.log(progress.data.data.progression[0].workouts)}</p>
            </div>): <div>Loading ...</div>}
        </>
    )
}