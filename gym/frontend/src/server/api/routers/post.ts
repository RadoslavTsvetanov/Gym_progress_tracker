import { object, z } from "zod";
import axios from "axios"
import {application_url, gateway_url} from "~/pages/constant_variables/constants"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface Result{
  data:object
}

interface Headers{
  authorization:string
}


enum REQUEST_TYPE{
  POST = 'POST',
  GET = 'GET'
}

//! Teacher told me these are called factories so should rename later
async function axios_request(url:string, req_data:object, method:REQUEST_TYPE, headers:Headers) {
  try {
    console.log("sefe mi se",req_data)
    const response = await axios({
      method: method,
      url: url,
    data: req_data,
      headers: headers,
    });

    return response;
  } catch (error) {
    console.error('Request error:', error);
    throw error; 
  }
}

async function axios_query(url:string, req_data:object, method:REQUEST_TYPE, headers:object) {
   try {
    const response = await axios({
      method: method,
      url: url,
      params: req_data,
      headers: headers,
    });

    return response;
  } catch (error) {
    console.error('Request error:', error);
    throw error; 
  }
} // i know the terminology is not entirely correct since query is a type of a request but will fix it later

export const postRouter = createTRPCRouter({
  get_exercises: publicProcedure
    .input(z.object({ username: z.string(),token: z.string()}))
    .query(async ({ input }) => {
      try {
        const response: Result = await axios_query(`${gateway_url}/exercises/get_program`, {
          username: input.username,
        }, REQUEST_TYPE.GET, {
          authorization:input.token
        });
        const { data } = response;
        return {
          data 
        };
      } catch (error) {
        console.log(error);
        return {
          error:error
        }
      }
    }),

  create_program: publicProcedure
    .input(z.object({ username: z.string().min(1),program: z.unknown(),token:z.string() }))
    .mutation(async ({ input }) => {
      try {
        console.log(input.program)
        const res: Result = await axios_request(`${gateway_url}/exercises/create_user`, { username: input.username, program: input.program.program }, REQUEST_TYPE.POST, {
          authorization:input.token
        });
        const { data } = res;
        return {
          data
        }
      } catch (err) {
        return {error:err};
}
    }),

  get_progression: publicProcedure
    .input(z.object({ username: z.string(), token: z.string() }))
    .query(async ({ input }) => {
     try{
    
      const res: Result = await axios_query(`${gateway_url}/exercises/get_progression`, { username: input.username }, REQUEST_TYPE.GET, {
        authorization: input.token
      })
       console.log(res)
     const {data} = res
     
       return {
         data
       }
     } catch (err) {
        return err
      }
    }),
  

    add_workout: publicProcedure
    .input(z.object({username:z.string(),token: z.string(),workout:z.unknown()}))
      .mutation(async ({ input }) => {
        try {
          const res: Result = await axios_request(`${gateway_url}/exercises/add_new_workout`, { username: input.username, workout: input.workout }, REQUEST_TYPE.POST, { authorization: input.token })
          const { data } = res;
          return { 
            data
          }
         } catch (err) {
          console.log(err)
          return {
            status: 401,
            err
        }}
    })
});
