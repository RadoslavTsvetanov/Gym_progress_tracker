"use client"
import Head from "next/head";
import Link from "next/link";
import { CookieHandler } from "~/utils/cookie_handler";
import { api } from "~/utils/api";
import { useEffect, useState } from "react"
import { PreviousWorkout } from '~/components/render_progress_workouts';
import Cookies from "js-cookie"
import { User,Exercise, Workout, Program } from "~/utils/types"
import { application_url } from "./constant_variables/constants"
import { Helper_functions } from "~/utils/helper_functions";
function Filter() {

}


export default function History() {
    const [type_of_workout, set_type_of_workout] = useState<string | undefined>()
    const cookie_helper = new CookieHandler;
    const [user,set_user] = useState<User | undefined>()
    const progress: object | undefined = api.post.get_progression.useQuery((user != undefined ? {username:user.username,token:user.token}:{}),{enabled:user != undefined})
    useEffect(() => {
        set_user(cookie_helper.extract_cookie('user')) //! ran in useEffect cuz it needs the component to be rendered to have access to the window 
    },[])
    return (
        <>
        {(progress != undefined && progress.data != undefined && user != undefined && progress.data.data != undefined) ? ( <div>
                <p>{console.log(progress.data.data.progression[0].workouts)}</p>
                {PreviousWorkout({type:type_of_workout,exercises:progress.data.data,renderAll:true})}
            </div>): <div>Loading ...</div>}
        </>
    )
}