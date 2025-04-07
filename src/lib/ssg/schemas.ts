import z from 'zod';

export const z_component = <T extends string>(...components: [T, ...T[]]) =>
  z
    .object({
      component: z.enum(components)
    })
    .passthrough();
