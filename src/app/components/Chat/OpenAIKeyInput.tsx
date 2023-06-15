import { KeyIcon } from "@heroicons/react/outline";
import { Button, Card, Flex, Text, TextInput, Title } from "@tremor/react";
import { useState } from "react";

export const OpenAIKeyInput = () => {
  const [openAIKey, setOpenAIKey] = useState<string>("");

  return (
    <Card>
      <Title>Chat</Title>
      <Text>
        To start, we&apos;ll need your OpenAI API Key, you can find it{" "}
        <a
          className="text-blue-600 underline"
          href="https://platform.openai.com/account/api-keys"
        >
          here
        </a>
      </Text>
      <Flex className="gap-2">
        <TextInput
          className="w-full"
          placeholder="Enter your OpenAI API key here..."
          value={openAIKey}
          onChange={({ target }) => setOpenAIKey(target.value)}
        />
        <Button
          icon={KeyIcon}
          onClick={() => {
            // save the openAI api key to localStorage
            localStorage.setItem("openAIKey", openAIKey);

            // rerender
            window.location.reload();
          }}
        />
      </Flex>
    </Card>
  );
};
