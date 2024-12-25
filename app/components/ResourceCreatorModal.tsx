'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface ResourceCreatorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ResourceCreatorModal({ isOpen, onClose }: ResourceCreatorModalProps) {
  const [text, setText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/embedding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()

      if (response.ok) {
        toast("اضافه شد")
        setText('') // Clear the input after successful submission
        onClose() // Close the modal after successful submission
      } else {
        throw new Error(data.error || 'خطایی رخ داد')
      }
    } catch (error: any) {``
      toast('خطایی پیش آمد')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-right">ایجاد منبع جدید</DialogTitle>
          <DialogDescription className="text-right">
            اطلاعات جدید را برای اضافه کردن به دانش ربات وارد کنید
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="متن خود را اینجا وارد کنید"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="min-h-[150px] text-right bg-white/10 border-white/10 text-white placeholder-white/50 focus:ring-white focus:border-white"
            dir="rtl"
          />
          <Button 
            type="submit" 
            className="w-full text-lg bg-white/10 border-white/10 text-white hover:bg-white/20" 
            disabled={isLoading}
          >
            {isLoading ? 'در حال ایجاد...' : 'ایجاد منبع'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

