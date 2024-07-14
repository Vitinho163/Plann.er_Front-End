import { Plus, User, X } from "lucide-react";
import { ImportantLinks } from "../trip-details/important-links";
import { Guests } from "../trip-details/guests";
import { Activities } from "../trip-details/activities";
import { DestinationAndDateHeader } from "../trip-details/destination-and-date-header";
import { Button } from "../../components/button";
import { useParams } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from 'react-router-dom'
import { Footer } from "../../components/footer";

interface Trip {
  id: string
  destination: string
  starts_at: string
  ends_at: string
  is_confirmed: boolean
}

export function ConfirmParticipant() {
  const navigate = useNavigate()
  const { tripId, participantId } = useParams()
  const [trip, setTrip] = useState<Trip | undefined>()

  const displayedDate = trip
    ? format(trip.starts_at, "d").concat(' a ').concat(format(trip.ends_at, "d' de 'LLLL' de 'yyyy", { locale: ptBR })) 
    : null

  useEffect(() => {
    api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip))
    api.get(`/participants`)
  }, [tripId])

  async function confirmParticipant(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const name = data.get('name')?.toString()
    const email = data.get('email')?.toString()

    await api.patch(`/participants/${participantId}/confirm`, {
      name,
      email,
      tripId
    })

    navigate(`/trips/${tripId}`)
  }

  return (
    <div className="max-w-6xl px-6 py-10 mx-auto space-y-8">
      <DestinationAndDateHeader />

      <main className="flex gap-16 px-4">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Atividades</h2>
            <Button variant="primary">
              <Plus className='size-5' />
              Cadastrar atividade
            </Button>
          </div>

          <Activities />
        </div>

        <div className="w-80 space-y-6">
          <ImportantLinks />
          <div className='w-full h-px bg-zinc-800' />
          <Guests />
        </div>
      </main>

      
      <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
        <div className='w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>Confirmar participação</h2>
              <button type='button'>
                <X className='size-5 text-zinc-400' />
              </button>
            </div>
            <p className='text-sm text-zinc-400'>
              Você foi convidado(a) para participar de uma viagem para <span className='font-semibold text-zinc-100 '>{trip?.destination}</span> nas datas de <span className='font-semibold text-zinc-100 '>{displayedDate}</span> <br /><br />Para confirmar sua presença na viagem, preencha os dados abaixo:
            </p>
          </div>

          <form onSubmit={confirmParticipant} className='space-y-3'>
            <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
              <User className='text-zinc-400 size-5' />
              <input 
                name="name" 
                placeholder="Seu nome completo" 
                className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" 
                required
              />
            </div>

            <div className='h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2'>
              <User className='text-zinc-400 size-5' />
              <input 
                type="email" 
                name="email" 
                placeholder="Seu e-mail" 
                className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" 
                required
              />
            </div>

            <Button type="submit" variant="primary" size="full">
              Confirmar minha presença
            </Button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}