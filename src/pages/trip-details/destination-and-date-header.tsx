import { MapPin, Calendar, Settings2, X } from "lucide-react";
import { Button } from "../../components/button";
import { useParams } from 'react-router-dom'
import { api } from "../../lib/axios";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";

interface Trip {
  id: string
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

export function DestinationAndDateHeader() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState<Trip | undefined>()

  const [isDestinationAndDateModalOpen, setIsDestinationAndDateModalOpen] = useState(false)
  const [destination, setDestination] = useState('')
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<DateRange | undefined>()

  function openDestinationAndDateModal() {
    setIsDestinationAndDateModalOpen(true)
  }

  function closeDestinationAndDateModal() {
    setIsDestinationAndDateModalOpen(false)
  }

  function openDatePicker() {
    setIsDatePickerOpen(true)
  }

  function closeDatePicker() {
    setIsDatePickerOpen(false)
  }

  async function updateTrip() {

    if(!destination) {
      return
    }

    if(!eventStartAndEndDates) {
      return
    }

    await api.put(`/trips/${tripId}`, {
      destination,
      starts_at: eventStartAndEndDates.from,
      ends_at: eventStartAndEndDates.to,
    })

    console.log(destination)
    console.log(eventStartAndEndDates)

    window.document.location.reload()
  }

  useEffect(() => {
    api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip))
  }, [tripId])

  const displayedDate = trip
    ? format(trip.starts_at, "d' de 'LLL").concat(' até ').concat(format(trip.ends_at, "d' de 'LLL")) 
    : null

  const displayedDateInput = eventStartAndEndDates && eventStartAndEndDates.from && eventStartAndEndDates.to
  ? format(eventStartAndEndDates.from, "d' de 'LLL").concat(' até ').concat(format(eventStartAndEndDates.to, "d' de 'LLL")) 
  : null

  return (
    <div className="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <span className="text-zinc-100">{trip?.destination}</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-zinc-400" />
          <span className="text-zinc-100">{displayedDate}</span>
        </div>

        <div className='w-px h-6 bg-zinc-800' />

        <Button onClick={openDestinationAndDateModal}>
          Alterar local/data
          <Settings2 className='size-5' />
        </Button>
      </div>

      {isDestinationAndDateModalOpen && (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
          <div className='w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg font-semibold'>Atualizar viagem</h2>
                <button type='button' onClick={closeDestinationAndDateModal} >
                  <X className='size-5 text-zinc-400' />
                </button>
              </div>
              <p className='text-sm text-zinc-400'>
                Ao clicar em 'Confirmar' o local e data será alterado para o informado.
              </p>
            </div>


              <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
                <MapPin className='text-zinc-400 size-5' />
                <input 
                  name="destination" 
                  placeholder="Para onde você vai?" 
                  className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                  onChange={(event) => setDestination(event.target.value)} 
                />
                <button onClick={openDatePicker} className='flex items-center gap-2 text-left w-[280px]'>
                  <Calendar className='size-5 text-zinc-400' />
                  <span className="text-lg text-zinc-400 w-40 flex-1">
                    {displayedDateInput || 'Quando?'}
                  </span>
                </button>
              </div>

              <Button onClick={updateTrip} variant="primary" size="full">
                Confirmar
              </Button>

          </div>
        </div>
      )}

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

      {trip?.is_confirmed !== true && (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
        <div className='w-[520px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>Confirme a viagem!</h2>
              <button type='button'>
                <X className='size-5 text-zinc-400' />
              </button>
            </div>
            <p className='text-sm text-zinc-400'>
              O proprietário precisa confirmar a viagem em seu email!
            </p>
          </div>

          <Button onClick={() => window.document.location.reload()} variant="primary" size="full">
            Atualizar
          </Button>
        </div>
      </div>
      )}

    </div>
  )
}