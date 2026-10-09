import { useCallback, useEffect, useState, UIEvent } from 'react'
import { FieldValues, UseControllerProps } from 'react-hook-form'
import ControlledSelect from '~/components/form/ControlledSelect'
import { ErrorResponseDto } from '~/data/error.dto'
import { UserStatus } from '~/global/app-status'
import { useGardenManagerApi } from '~/hooks/api/useGardenManagerApi'
import { notifyError } from '~/utils/toastify'

interface GardenManagerSelectProps<TFieldValues extends FieldValues> {
  controller: UseControllerProps<TFieldValues>
}

const GardenManagerSelect = <TFieldValues extends FieldValues>({
  controller
}: GardenManagerSelectProps<TFieldValues>) => {
  const [gardenManagerOptions, setGardenManagerOptions] = useState<{ name: string; value: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorResponseDto | null>(null)
  const [gardenManagerSelectNextPage, setGardenManagerSelectNextPage] = useState<number | null>(null)
  const { getAllGardenManagers } = useGardenManagerApi()

  const getMoreGardenManagerOptions = useCallback(
    async (page: number, limit: number) => {
      setLoading(true)
      const { data, error } = await getAllGardenManagers(
        page,
        limit,
        [],
        [{ field: 'status', value: UserStatus.ACTIVE }]
      )

      if (data) {
        setGardenManagerOptions((prev) => [
          ...prev,
          ...data.docs.map((gardenManager) => ({ value: gardenManager._id, name: gardenManager.name }))
        ])
        setGardenManagerSelectNextPage(data.nextPage)
      }

      setError(error)
      setLoading(false)
    },
    [getAllGardenManagers]
  )

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    (async () => {
      setLoading(true)
      const { data, error } = await getAllGardenManagers(1, 10, [], [{ field: 'status', value: UserStatus.ACTIVE }])

      if (data) {
        setGardenManagerOptions(
          data.docs.map((gardenManager) => ({ value: gardenManager._id, name: gardenManager.name }))
        )
      }

      setError(error)
      setLoading(false)
    })()
  }, [getAllGardenManagers])

  const handleGardenManagerSelectScroll = (event: UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement

    if (
      target.clientHeight + target.scrollTop >= target.scrollHeight * 0.9 &&
      gardenManagerSelectNextPage &&
      !loading
    ) {
      getMoreGardenManagerOptions(gardenManagerSelectNextPage, 10)
    }
  }

  if (error) {
    notifyError(error.message)
  }

  return (
    <ControlledSelect
      controller={controller}
      label='Garden Managers'
      labelId='garden-manager-select-label'
      placeholder='Select Manager'
      items={gardenManagerOptions}
      fullWidth
      size='small'
      MenuProps={{
        PaperProps: {
          onScroll: handleGardenManagerSelectScroll,
          style: { maxHeight: '200px' }
        }
      }}
    />
  )
}

export default GardenManagerSelect
