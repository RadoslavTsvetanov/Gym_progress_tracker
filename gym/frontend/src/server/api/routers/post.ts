import { object, z } from "zod";
import axios from "axios"
import {gateway_url} from "~/pages/constant_variables/constants"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

interface Result{
  data:object
}




enum REQUEST_TYPE{
  POST = 'POST',
  GET = 'GET'
}
async function axios_request(url:string, req_data:object, method:REQUEST_TYPE, headers:object) {
  try {
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
        console.log("data--------------------------------")
        console.log(data)
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
        const res: Result = await axios_request(`${gateway_url}/exercises/create_user`, { username: input.username, program: input.program }, REQUEST_TYPE.POST, {
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
});
