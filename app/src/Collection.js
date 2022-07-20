import * as React from "react";
import {
  AlertTitle,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

function Collection({ collectionId, collectionName, setCollectionId }) {
  const [urls, setUrls] = React.useState(null);

  React.useEffect(() => {
    import(`./sitemaps/${collectionId}.json`)
      .then((module) => module.default)
      .then((data) => {
        setUrls(data);
      });
  }, []);

  if (!urls) {
    return (
      <Flex
        width="100vw"
        height="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner />
      </Flex>
    );
  }

  return (
    <Box>
      <Flex
        textAlign="center"
        justifyContent="center"
        flexDir="column"
        alignItems="center"
      >
        <Heading mb="50px">EPA Archive Archive</Heading>
        <Heading mb="50px" size="md" as="h2">
          <Button
            variant="ghost"
            onClick={() => {
              setCollectionId(null);
            }}
          >
            <IoArrowBack />
            Back
          </Button>{" "}
          {collectionName}
        </Heading>

        <Box width={{ base: "100vw", md: "50vw" }}>
          {urls.map((url) => (
            <Flex
              key={url}
              justifyContent="space-between"
              padding="8px"
              cursor="pointer"
              _hover={{
                textDecor: "underline",
                bg: "gray.100",
              }}
              alignItems="center"
              borderRadius="7px"
            >
              <Link
                width={{ base: "80vw", md: "40vw" }}
                textAlign="left"
                onClick={async () => {
                  let response = await fetch(
                    `http://archive.org/wayback/available?url=${url}`
                  );
                  let data = await response.json();
                  const link = data?.archived_snapshots?.closest?.url;
                  if (link) {
                    setUrls(null);
                    setTimeout(() => {
                      window.location = link;
                    }, 200);
                  } else {
                    setUrls(null);
                    setTimeout(() => {
                      window.location = `https://web.archive.org/web/*/${url}`;
                    }, 200);
                  }
                }}
                //href={`https://web.archive.org/web/*/${url}`}
              >
                {url.replace("https://archive.epa.gov", "")}
              </Link>
              <IoArrowForward />
            </Flex>
          ))}
        </Box>
      </Flex>
    </Box>
  );
}

export default Collection;
