"use client"
import { User } from "~/utils/types"
import { CookieHandler } from "~/utils/cookie_handler";
import { api } from "~/utils/api";
import {useEffect,useState} from "react"
interface FormData{

}
export default function Workout() {
    const cookie_handler = new CookieHandler;
    const [user,set_user] = useState<User | undefined>(undefined)
    const data = api.post.get_exercises.useQuery(user != undefined ?{username:user.username,token:user.toekn}:{username:"",token:""})
    useEffect(() => {
       const cookie: string | boolean = cookie_handler.checkForCookie('user');
        cookie_handler.redirectToLoginIfNoCookie(cookie);

        if (typeof cookie === 'string') {
            const user: User | undefined = cookie_handler.parseCookieToUser(cookie);
            set_user(user);//TODO later to be merged into just two function - the whole functionality in the useEffect
  }
  

        function submit_form() {
      
  }
    },[])
    return (
        <div>
            {user != undefined
                ?
                    (<form>
                        <input/>
                    </form>)
                :
                (
                    <div>
                        Loading ...
                    </div>
                    )
            }
        </div>
    )
}