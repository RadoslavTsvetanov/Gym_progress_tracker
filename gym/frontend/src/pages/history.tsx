"use client"
import Head from "next/head";
import Link from "next/link";
import { CookieHandler } from "~/utils/cookie_handler";
import { api } from "~/utils/api";
import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { User,Exercise, Workout, Program } from "~/utils/types"
import { application_url } from "./constant_variables/constants"
export default function History(){
    return (
        <div>
            <p></p>
        </div>
    )
}