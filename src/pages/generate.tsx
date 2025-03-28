import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import React, { useState } from "react"
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
  CardFooter,
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
import { Info, LoaderCircle, RefreshCw } from "lucide-react"
import { useGenerateAI } from "@/hooks/mutation/api/useGenerateAI"
import { useStaking } from "@/hooks/query/useStaking"
import { Staking } from "@/types/staking"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import DialogStake from "@/components/dialog/dialog-stake"

const chainLogos = [
  { name: 'Arbitrum Sepolia', logo: '/chains/arbitrum-logo.png' },
  { name: 'Base Sepolia', logo: '/chains/base-logo.png' },
  { name: 'Decaf Testnet', logo: '/chains/decaf-logo.png' },
];

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
  const toast = useToast();
  const [open, setOpen] = useState(false)

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

      await mutation.mutateAsync({ formattedSubmission }, {
        onSuccess: () => {
          toast({
            title: "Risk Profile Generated",
            description: "Your personalized risk profile has been created successfully.",
          })

          setTimeout(() => {
            window.location.reload()
          }, 2000)
        }
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
    localStorage.removeItem("risk")
    localStorage.removeItem("idProtocol")
    form.reset()
    window.location.reload()
  }

  const staking = sData && idProtocolSaved && sData.find((item) => item.idProtocol === idProtocolSaved) as Staking

  return (
    <React.Fragment>
      <DialogStake
        open={open} 
        onClose={() => setOpen(false)} 
        addressStaking={typeof staking === "object" ? staking?.addressStaking : ""}
        addressToken={typeof staking === "object" ? staking?.addressToken : ""}
      />
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
          <>
            <Card className="mb-6 p-2 shadow-lg rounded-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-bold">Risk Profile Generated</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Your personalized risk profile has been successfully created.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                <p className="text-sm text-muted-foreground">Risk Profile:</p>
                <p className="text-2xl font-bold text-primary">{riskSaved}</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" className="flex items-center gap-2" onClick={handleReset}>
                  <RefreshCw className="h-4 w-4" />
                  Regenrate
                </Button>
              </CardFooter>
            </Card>
            {staking && (
              <Card
                className="hover:shadow-lg transition-shadow flex flex-col min-w-[230px]"
              >
                <CardHeader className="flex flex-row items-center space-x-4 pb-2 relative">
                  <div className="flex min-w-20 relative -mt-8 sm:-mt-12">
                    <div className="absolute z-0 top-0">
                      <div className="relative h-8 w-8 sm:h-12 sm:w-12">
                        {chainLogos.find(chain => chain.name === staking.chain)?.logo && (
                          <Image
                            src={chainLogos.find(chain => chain.name === staking.chain)?.logo || '/default-logo.png'}
                            alt={`${staking.chain} logo`}
                            fill
                            className="object-contain"
                          />
                        )}
                      </div>
                    </div>
                    <div className='absolute z-10 left-5 sm:left-7 top-0'>
                      <div className="relative h-8 w-8 sm:h-12 sm:w-12">
                        <Image
                          src={staking.logo}
                          alt={`${staking.nameProject} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <CardTitle className="text-base sm:text-lg">{staking.nameProject}</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      {staking.nameToken} • {staking.chain}
                    </CardDescription>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4 space-y-3 flex-grow">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">APY</p>
                      <p className="font-semibold text-green-600 text-sm sm:text-base">
                        {staking.apy}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">TVL</p>
                      <p className="font-semibold text-sm sm:text-base">
                        ${(staking.tvl / 1_000_000).toFixed(1)}M
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {staking.categories.map(category => (
                      <Badge
                        key={category}
                        variant="secondary"
                        className="text-xs"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                          <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> Details
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Protocol Details</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button size="sm" className="text-xs sm:text-sm" onClick={() => setOpen(true)}>Stake Now</Button>
                </CardFooter>
              </Card>
            )}
          </>
        )}
      </div>
    </React.Fragment>
  )
}

export default Generate;