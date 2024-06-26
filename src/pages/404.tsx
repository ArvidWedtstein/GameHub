import * as React from "react";
import { Link, HeadFC, PageProps } from "gatsby";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Code,
  Container,
  Heading,
} from "@chakra-ui/react";

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Container centerContent>
      <Card margin="auto 0">
        <CardHeader alignContent={"center"}>
          <Heading textAlign="center" size="md">
            Page not found
          </Heading>
        </CardHeader>

        <CardBody>
          Sorry 😔, we couldn’t find what you were looking for.
          <br />
          {process.env.NODE_ENV === "development" ? (
            <>
              <br />
              Try creating a page in{" "}
              <Code colorScheme="yellow" children="src/pages/" />.
              <br />
            </>
          ) : null}
          <Button variant="link" as={Link} to={"/"}>
            Go home
          </Button>
        </CardBody>
      </Card>
    </Container>
  );
};

export default NotFoundPage;

export const Head: HeadFC = () => <title>Not found</title>;
