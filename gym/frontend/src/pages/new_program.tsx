"use client"
import { useState,useEffect } from "react"
import { api } from "~/utils/api";
import { CookieHandler } from "~/utils/cookie_handler";
interface FormData{
    workout_type:string
}
export default function Workout() {
    const [form_data, set_form_data] = useState<FormData | undefined>(undefined)
    const cookie_handler = new CookieHandler();
    const data = api.post.create_program.useMutation(form_data)
    useEffect(() => {
        
    },[data])
    return (
        <div>
            {
                form_data == undefined
                    ? (<div>loading ...</div>)
                    : (
                        <div>
                            <h1>{ form_data.workout_type}</h1>
                        </div>
                    )
            }
    </div>
        
    )
}