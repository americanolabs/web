import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import type { NextPage } from 'next'

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@chakra-ui/react';
import { LoaderCircle, RefreshCw } from "lucide-react"
import { useGenerateAI } from "@/hooks/mutation/api/useGenerateAI"
import { useStaking } from "@/hooks/query/useStaking"
import { Staking } from "@/types/staking"

const RiskProfileSchema = z.object({
  riskLoss: z.number().min(0).max(2, "Please select an option"),
  lockupPeriod: z.number().min(0).max(2, "Please select an option"),
  securityAssessment: z.number().min(0).max(2, "Please select an option"),
  diversificationStrategy: z.number().min(0).max(2, "Please select an option"),
  marketFluctuationResponse: z.number().min(0).max(2, "Please select an option"),
})

type RiskProfileData = z.infer<typeof RiskProfileSchema>

const riskProfileQuestions = [
  {
    id: "riskLoss" as const,
    label: "How do you feel about potential losses in staking investments?",
    options: [
      "Very uncomfortable with any losses",
      "Willing to accept minor losses",
      "Comfortable with moderate risk"
    ]
  },
  {
    id: "lockupPeriod" as const,
    label: "How long are you willing to lock up your staked assets?",
    options: [
      "Short term (1-3 months)",
      "Medium term (3-12 months)",
      "Long term (1+ years)"
    ]
  },
  {
    id: "securityAssessment" as const,
    label: "How do you assess smart contract security before staking?",
    options: [
      "Basic research only",
      "Review audits and documentation",
      "Deep technical analysis"
    ]
  },
  {
    id: "diversificationStrategy" as const,
    label: "What is your approach to diversification in staking?",
    options: [
      "Single asset staking",
      "Multiple assets, same network",
      "Multiple assets across networks"
    ]
  },
  {
    id: "marketFluctuationResponse" as const,
    label: "How do you react to market fluctuations affecting your staked assets?",
    options: [
      "Likely to unstake during volatility",
      "Hold through minor fluctuations",
      "Maintain long-term staking regardless"
    ]
  }
]

const Generate: NextPage = () => {
  const toast = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutation, riskSaved, idProtocolSaved } = useGenerateAI()
  const { sData } = useStaking()

  const form = useForm<RiskProfileData>({
    resolver: zodResolver(RiskProfileSchema),
    defaultValues: {
      riskLoss: undefined,
      lockupPeriod: undefined,
      securityAssessment: undefined,
      diversificationStrategy: undefined,
      marketFluctuationResponse: undefined
    }
  })

  const onSubmit = async (data: RiskProfileData) => {
    setIsSubmitting(true)

    try {
      const formattedSubmission = riskProfileQuestions.map((question) =>
        `${question.label} = ${question.options[data[question.id]]}`
      ).join(". ")

      await mutation.mutateAsync({ formattedSubmission })

      toast({
        title: "Risk Profile Generated",
        description: "Your personalized risk profile has been created successfully.",
      })
    } catch (error) {
      toast({
        title: "Submission Error",
        description: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    form.reset()
  }

  const staking = sData && idProtocolSaved && sData.find((item) => item.idProtocol === idProtocolSaved) as Staking

  return (
    <div className="container mx-auto max-w-2xl py-10 px-4">
      {!idProtocolSaved ? (
        <Card>
          <CardHeader>
            <CardTitle>Staking Risk Profile Generator</CardTitle>
            <CardDescription>
              Answer the following questions to create a personalized staking risk profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {riskProfileQuestions.map((question) => (
                  <FormField
                    key={question.id}
                    control={form.control}
                    name={question.id}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{question.label}</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value !== undefined ? field.value.toString() : undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {question.options.map((option, index) => (
                              <SelectItem
                                key={index}
                                value={index.toString()}
                                className="cursor-pointer"
                              >
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Risk Profile"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Risk Profile</CardTitle>
            <CardDescription>
              Personalized staking risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">{riskSaved}</p>
              {staking && (
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-2">Recommended Staking Protocol</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-muted-foreground">Project:</span>
                      <p>{staking.nameProject}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Token:</span>
                      <p>{staking.nameToken}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">APY:</span>
                      <p>{staking.apy}%</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Chain:</span>
                      <p>{staking.chain}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="w-full mr-2"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate New Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Generate;