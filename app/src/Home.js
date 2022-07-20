import * as React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  StatArrow,
  Text,
} from "@chakra-ui/react";
import collections from "./sitemaps/index-sorted.json";
import { IoArrowForward } from "react-icons/io5";
import Collection from "./Collection";

// const collectionUrlMap = {};
// sitemapindex.forEach((collectionUrl) => {
//   collectionUrlMap[collectionUrl] = true;
// });

// const collectionIds = Object.keys(collectionUrlMap)
//   .map((collectionUrl, i) => {
//     const idWithNumber = collectionUrl
//       .substring(
//         collectionUrl.lastIndexOf("/") + 1,
//         collectionUrl.lastIndexOf(".")
//       )
//       .replace("_0", "");
//     // if(collectionIds[i + 1] && collectionIds[i + 1].includes())
//     return idWithNumber;
//   })
//   .sort((a, b) => a.localeCompare(b))
//   .map((id) => ({ id, name: id }));
// console.log(collectionIds);

function Home() {
  const [collectionId, setCollectionId] = React.useState(null);
  const [collectionName, setCollectionName] = React.useState(null);

  if (collectionId) {
    return (
      <Collection
        collectionId={collectionId}
        collectionName={collectionName}
        setCollectionId={setCollectionId}
      />
    );
  }

  return (
    <Flex
      textAlign="center"
      justifyContent="center"
      flexDir="column"
      alignItems="center"
    >
      <Heading mb="50px" mt="20px" as="h1">
        EPA Archive Archive
      </Heading>
      <Heading as="h2" size="sm" maxW="400px">
        A very unofficial first attempt to archive the EPA Archive, which is
        being sunsetted in July, 2022. Links to the Wayback Machine.
      </Heading>
      <Link
        mb="50px"
        mt="20px"
        href="https://github.com/dfeehrer/EPA-Archive-Archive"
      >
        Github
      </Link>

      <Box width={{ base: "100vw", md: "50vw" }}>
        {collections.map((collection) => (
          <Flex
            borderRadius="7px"
            key={collection.id}
            justifyContent="space-between"
            padding="8px"
            cursor="pointer"
            onClick={() => {
              setCollectionId(collection.id);
              setCollectionName(collection.name);
            }}
            _hover={{
              textDecor: "underline",
              bg: "gray.100",
            }}
            alignItems="center"
          >
            <Text>{collection.name}</Text>
            <IoArrowForward />
          </Flex>
        ))}
      </Box>
    </Flex>
  );
}

export default Home;
