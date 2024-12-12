'use client'

import { useCallback, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface InvitationDetails {
  amount: string
  expiration: string
  delegationHash: string
}

export default function AcceptInvite() {
  const [isLoading, setIsLoading] = useState(false)
  const [inviteDetails, setInviteDetails] = useState<InvitationDetails | null>(null)
  const params = useParams()
  const { toast } = useToast()

  const fetchInviteDetails = useCallback(async () => {
    try {
      const delegationHash = params.delegationHash as string
      
      if (!delegationHash) {
        throw new Error('Invalid invitation link')
      }

      setInviteDetails({
        delegationHash,
        amount: "1",
        expiration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load invitation details",
      })
    }
  }, [params.delegationHash, toast])

  useEffect(() => {
    fetchInviteDetails()
  }, [fetchInviteDetails])


  const handleAcceptInvite = async () => {
    try {
      setIsLoading(true)

      toast({
        title: "Success",
        description: "Invitation accepted successfully!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept invitation",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!inviteDetails) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 pt-16 bg-slate-50">
      <div className="max-w-md mx-auto">
        <Card className="w-full shadow-lg border-slate-200">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome!</CardTitle>
            <CardDescription className="text-center text-base">
              You&apos;ve been invited to receive funds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 rounded-lg bg-slate-50 p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Amount</span>
                <span className="font-semibold text-slate-900">{inviteDetails?.amount} wei</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Expires</span>
                <span className="font-semibold text-slate-900">
                  {inviteDetails?.expiration && new Date(inviteDetails.expiration).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Delegation Hash</span>
                <span className="font-mono text-sm text-slate-900 truncate max-w-[200px]">
                  {inviteDetails?.delegationHash}
                </span>
              </div>
            </div>

            <Button 
              onClick={handleAcceptInvite} 
              className="w-full font-semibold h-11"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Accepting..." : "Accept Invitation"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 