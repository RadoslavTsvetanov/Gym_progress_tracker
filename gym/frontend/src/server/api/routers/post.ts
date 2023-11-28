import { z } from "zod";
import axios from "axios"
import {gateway_url} from "~/pages/constant_variables/constants"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
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
let post = {
  id: 1,
  name: "Hello World",
};

export const postRouter = createTRPCRouter({
  get_requests: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({ input }) => {
      try {
        const response = await axios_request(`${gateway_url}/exercises/`,{},REQUEST_TYPE.GET,{});
        const { data } = response;
        
        return {
          greeting: data 
        };
      } catch (error) {
        console.log(error);
      }
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      post = { id: post.id + 1, name: input.name };
      return post;
    }),

  getLatest: publicProcedure.query(() => {
    return post;
  }),
});
