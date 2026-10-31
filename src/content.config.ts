import { defineCollection } from "astro:content";
import { glob, type Loader, type ParseDataOptions } from "astro/loaders";
import { z } from "astro/zod";

type GlobOptions = Parameters<typeof glob>[0];

interface GlobWithCustomDataOptions<TCustomData extends Record<string, unknown>>
  extends GlobOptions {
  getCustomData: (
    props: ParseDataOptions<Record<string, unknown>>,
  ) => TCustomData;
}

const globWithCustomData = <TCustomData extends Record<string, unknown>>({
  getCustomData,
  ...baseOptions
}: GlobWithCustomDataOptions<TCustomData>): Loader => {
  const baseLoader = glob(baseOptions);

  return {
    name: "post-loader",
    load: async (context) => {
      await baseLoader.load({
        ...context,
        parseData: (props) => {
          return context.parseData({
            ...props,
            data: {
              ...props.data,
              ...getCustomData(props),
            },
          });
        },
      });
    },
  };
};

const posts = defineCollection({
  loader: globWithCustomData({
    base: "./src/posts",
    pattern: "*.md",
    generateId: ({ entry }) => {
      return entry.replace(/\.md$/u, "");
    },
    getCustomData: ({ id }) => {
      const match = id.match(/^(?<date>\d{4}-\d{2}-\d{2})-(?<name>.+)$/u);
      const { date, name } = match?.groups ?? {};
      if (!date || !name) {
        throw new Error(
          `Invalid post ID "${id}": expected format "YYYY-MM-DD-name".`,
        );
      }
      const publishedAt = Temporal.PlainDate.from(date);
      return {
        slug: `${publishedAt.year}/${name}`,
        publishedAt,
      };
    },
  }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    lang: z.string(),
    publishedAt: z.instanceof(Temporal.PlainDate),
  }),
});

export const collections = {
  posts,
};
