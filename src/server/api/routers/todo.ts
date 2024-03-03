import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { todoInput } from "../../../types/todo.input";

export const todoRouter = createTRPCRouter({
  all: protectedProcedure.query(async ({ ctx }) => {
    const todos = await ctx.db.todo.findMany({
      orderBy: { createdAt: "desc" },
      where: { user: { id: ctx.session.user.id } },
    });

    return todos.map(t => ({ id: t.id, title: t.title, done: t.done }));
  }),

  create: protectedProcedure
    .input(todoInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          title: input.title,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string({ required_error: 'id required' }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.delete({
        where: { id: input }
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string({ required_error: 'id required' }), done: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.todo.update({
        where: { id: input.id },
        data: {
          done: input.done,
        }
      });
    }),
});
