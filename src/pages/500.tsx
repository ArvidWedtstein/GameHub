import * as React from "react";
import { Link, HeadFC, PageProps } from "gatsby";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Heading,
} from "@chakra-ui/react";

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <Container centerContent>
      <Card margin="auto 0">
        <CardHeader alignContent={"center"}>
          <Heading textAlign="center" size="md">
            500 error
          </Heading>
        </CardHeader>

        <CardBody>
          Sorry 😔, we couldn’t find what you were looking for.
          <br />
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
