import Loading from '@/components/loader/loading';
import { useCreateWalletAI } from '@/hooks/mutation/api/useCreateWalletAI';
import { useGenerateAI } from '@/hooks/mutation/api/useGenerateAI';
import useGenerateContent from '@/hooks/query/api/useGeneratedContent';
import { useAddressAI } from '@/hooks/query/useAddressAI';
import { Box, Button, Heading, VStack, RadioGroup, Radio, Stack, Text, useToast } from '@chakra-ui/react';
import type { NextPage } from 'next';
import React, { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';

export const dataForm = {
  questions: [
    {
      question: "How do you feel about potential losses in staking investments?",
      options: ["Very uncomfortable with any losses", "Willing to accept minor losses", "Comfortable with moderate risk"],
    },
    {
      question: "How long are you willing to lock up your staked assets?",
      options: ["Short term (1-3 months)", "Medium term (3-12 months)", "Long term (1+ years)"],
    },
    {
      question: "How do you assess smart contract security before staking?",
      options: ["Basic research only", "Review audits and documentation", "Deep technical analysis"],
    },
    {
      question: "What is your approach to diversification in staking?",
      options: ["Single asset staking", "Multiple assets, same network", "Multiple assets across networks"],
    },
    {
      question: "How do you react to market fluctuations affecting your staked assets?",
      options: ["Likely to unstake during volatility", "Hold through minor fluctuations", "Maintain long-term staking regardless"],
    },
  ],
};

interface FormData {
  [key: number]: number | null;
}

const Generate: NextPage = () => {
  // idle
  const { isConnected } = useAccount();
  const { addressAI, laAI } = useAddressAI();
  
  // 1. Create AI Wallet
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const { address } = useAccount();

  const { mutation: mCreateWallet, result: rCreateWallet } = useCreateWalletAI()

  const handleCreate = () => {
    mCreateWallet.mutate({
      "user_address": address as string
    })
  }

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // 1. Created Successfully
  const { riskSaved: risk, protocolIdSaved: protocolId } = useGenerateContent();

  // 2. Fill Questionnaire
  const [formData, setFormData] = useState<FormData>({});
  const { mutation } = useGenerateAI();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const hasEmptyAnswers = Object.values(formData).some(
      (value) => value === null || value === undefined
    );

    if (Object.keys(formData).length !== dataForm.questions.length || hasEmptyAnswers) {
      toast({
        title: "Incomplete Form",
        description: "Please answer all questions before submitting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formattedSubmission = Object.entries(formData)
      .map(([questionIndex, answerIndex]) => {
        const qIndex = parseInt(questionIndex);
        return `${dataForm.questions[qIndex].question} = ${dataForm.questions[qIndex].options[answerIndex as number]}`;
      })
      .join(". ");

    mutation.mutate({ formattedSubmission });
  };

  const handleChange = (index: number, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [index]: value === null ? null : parseInt(value),
    }));
  };

  if (laAI) {
    return <Loading className="z-[90]"/>;
  }

  return (
    <Box maxW="600px" mx="auto" py={10} px={6} bg="gray.900" color="white" borderRadius="md" boxShadow="lg">
      <Heading size="lg" textAlign="center" mb={6}>Generate AI Wallet</Heading>

      <VStack align="stretch" spacing={6}>
        <Box>
          <Text fontSize="lg" fontWeight="bold">1. Create AI Wallet</Text>
          <Button colorScheme="blue" mt={2} w="full">Create Wallet</Button>
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="bold">2. Fill Questionnaire</Text>
          {dataForm.questions.map((q, index) => (
            <Box key={index} p={4} borderWidth={1} borderRadius="md" mt={4} bg="gray.800">
              <Text fontWeight="medium" mb={2}>{q.question}</Text>
              <RadioGroup onChange={(val) => handleChange(index, val)} value={formData[index]?.toString() || ""}>
                <Stack direction="column">
                  {q.options.map((option, optIndex) => (
                    <Radio key={optIndex} value={optIndex.toString()}>{option}</Radio>
                  ))}
                </Stack>
              </RadioGroup>
            </Box>
          ))}

          <Button mt={6} colorScheme="green" w="full" onClick={handleSubmit}>Submit</Button>
        </Box>

        <Box>
          <Text fontSize="lg" fontWeight="bold">3. Generated Content</Text>
          <Box p={4} borderWidth={1} borderRadius="md" mt={2} bg="gray.800">
            <Text color="gray.400">(Generated result will appear here)</Text>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default Generate;