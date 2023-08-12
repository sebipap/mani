import { Flex, Text, TextInput, Title } from "@tremor/react";
import { Card } from "@/components/ui/card";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { track } from "@/app/lib/analytics";

export const OpenAIKeyInput = () => {
  const [openAIKey, setOpenAIKey] = useState<string>("");

  return (
    <Card className="p-5 w-[100%]">
      Chat
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
        <Input
          className="w-full"
          placeholder="Enter your OpenAI API key here..."
          value={openAIKey}
          onChange={({ target }) => setOpenAIKey(target.value)}
        />
        <Button
          onClick={() => {
            // save the openAI api key to localStorage
            localStorage.setItem("openAIKey", openAIKey);
            // rerender
            window.location.reload();
            track("BUTTON_CLICKED", {
              text: "Ok",
              location: "OpenAIKeyInput",
            });
          }}
        >
          Ok
        </Button>
      </Flex>
    </Card>
  );
};
