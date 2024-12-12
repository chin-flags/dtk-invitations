'use client'

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
const formSchema = z.object({
  amount: z.string().refine((val) => {
    const num = BigInt(val || '0')
    return num > BigInt(0)
  }, {
    message: "Please enter a valid amount in wei greater than 0",
  }),
})

export default function Invite() {
  const [isLoading, setIsLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState<string>("")
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const mockDelegationHash = "0x" + Math.random().toString(16).slice(2)
      
      const generatedLink = `${window.location.origin}/accept-invite/${mockDelegationHash}`
      setInviteLink(generatedLink)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate invitation link. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      toast({
        title: "Success",
        description: "Invitation link copied to clipboard!",
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy to clipboard",
      })
    }
  }

  return (
    <div className="h-fit">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle>Send Invitation</CardTitle>
          <CardDescription>
            Enter the amount you want to send with the invitation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (wei)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter amount in wei" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the amount in wei you want to send
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Generating..." : "Generate Invitation Link"}
              </Button>
            </form>
          </Form>

          {inviteLink && (
            <div className="pt-2 space-y-2">
              <div className="flex gap-2">
                <Input 
                  value={inviteLink} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button 
                  onClick={copyToClipboard}
                  variant="outline"
                >
                  Copy
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}