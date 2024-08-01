import { ArrowRight, Calendar, MapPin, Settings2, X } from "lucide-react";
import { Button } from "../../../components/button";
import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { format } from 'date-fns'
import "react-day-picker/dist/style.css"

interface DestinationAndDateStepProps {
  isGuestsInputOpen: boolean
  eventStartAndEndDates: DateRange | undefined
  closeGuestsInput: () => void
  openGuestsInput: () => void
  setDestination: (destination: string) => void
  setEventStartAndEndDates: (dates: DateRange | undefined) => void
}

export function DestinationAndDateStep({
  closeGuestsInput,
  isGuestsInputOpen,
  openGuestsInput,
  setDestination,
  setEventStartAndEndDates,
  eventStartAndEndDates
}: DestinationAndDateStepProps) {
  const [isDatePickerOpen, serIsDatePickerOpen] = useState(false)

  function openDatePicker() {
    serIsDatePickerOpen(true)
  }

  function closeDatePicker() {
    serIsDatePickerOpen(false)
  }

  const displayedDate = eventStartAndEndDates && eventStartAndEndDates.from && eventStartAndEndDates.to
    ? format(eventStartAndEndDates.from, "d' de 'LLL").concat(' até ').concat(format(eventStartAndEndDates.to, "d' de 'LLL")) 
    : null

  return (
    <div className="bg-zinc-900 p-4 rounded-xl shadow-shape flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className='flex items-center gap-2 flex-1'>
        <MapPin className='size-5 text-zinc-400' />
        <input 
          disabled={isGuestsInputOpen} 
          type="text" 
          placeholder="Para onde você vai?" 
          className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" 
          onChange={(event) => setDestination(event.target.value)}
        />
      </div>

      <div className='flex items-center gap-2'>
        <button onClick={openDatePicker} disabled={isGuestsInputOpen} className='flex items-center gap-2 text-left flex-1'>
          <Calendar className='size-5 text-zinc-400' />
          <span className="text-lg text-zinc-400 overflow-hidden text-ellipsis whitespace-nowrap">
            {displayedDate || 'Quando?'}
          </span>
        </button>

        {isDatePickerOpen && (
          <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
            <div className='rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <h2 className='text-lg font-semibold'>Selecione a data</h2>
                  <button type='button' onClick={closeDatePicker}>
                    <X className='size-5 text-zinc-400' />
                  </button>
                </div>
              </div>

              <DayPicker mode="range" selected={eventStartAndEndDates} onSelect={setEventStartAndEndDates} disabled={{ before: new Date() }} />
            </div>
          </div>
        )}
      </div>

      <div className='w-px h-6 bg-zinc-800 hidden sm:block' />

      <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
        {isGuestsInputOpen ? (
          <Button onClick={closeGuestsInput} variant="secondary" className='w-full sm:w-auto'>
            Alterar local/data
            <Settings2 className='size-5' />
          </Button>
        ) : (
          <Button onClick={openGuestsInput} variant="primary" className='w-full sm:w-auto'>
            Continuar
            <ArrowRight className='size-5' />
          </Button>
        )}
      </div>
    </div>
  )
}