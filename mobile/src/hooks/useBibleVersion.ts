import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getLocalBibleVersions, type BibleVersion } from '../api/bible'

const VERSION_STORAGE_KEY = '@mkristo_bible_version'

export function useBibleVersion() {
  const [selectedVersion, setSelectedVersion] = useState<string>('KJV')
  const [versions, setVersions] = useState<BibleVersion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVersions()
    loadSavedVersion()
  }, [])

  async function loadVersions() {
    try {
      const versionList = await getLocalBibleVersions()
      setVersions(versionList)
    } catch (error) {
      console.error('Failed to load Bible versions:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadSavedVersion() {
    try {
      const saved = await AsyncStorage.getItem(VERSION_STORAGE_KEY)
      if (saved) {
        setSelectedVersion(saved)
      }
    } catch (error) {
      console.error('Failed to load saved version:', error)
    }
  }

  async function setVersion(versionCode: string) {
    try {
      await AsyncStorage.setItem(VERSION_STORAGE_KEY, versionCode)
      setSelectedVersion(versionCode)
    } catch (error) {
      console.error('Failed to save version:', error)
    }
  }

  const currentVersion = versions.find(v => v.code === selectedVersion)

  return {
    selectedVersion,
    currentVersion,
    versions,
    setVersion,
    loading
  }
}