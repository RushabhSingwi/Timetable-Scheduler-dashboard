'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export default function TimetableApp() {
  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [subjects, setSubjects] = useState([])
  const [classSubjects, setClassSubjects] = useState([])
  const [bookedLectures, setBookedLectures] = useState([])
  const [timetables, setTimetables] = useState(null)
  const [formData, setFormData] = useState({
    teacher: '',
    class_name: '',
    subject: '',
    day: '',
    time: '',
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const teachersResponse = await fetch('/api/teachers/')
      const classesResponse = await fetch('/api/classes/')
      const subjectsResponse = await fetch('/api/subjects/')
      const classSubjectsResponse = await fetch('/api/class-subjects/')
      const bookedLecturesResponse = await fetch('/api/booked-lectures/')

      const teachersData = await teachersResponse.json()
      const classesData = await classesResponse.json()
      const subjectsData = await subjectsResponse.json()
      const classSubjectsData = await classSubjectsResponse.json()
      const bookedLecturesData = await bookedLecturesResponse.json()

      setTeachers(teachersData)
      setClasses(classesData)
      setSubjects(subjectsData)
      setClassSubjects(classSubjectsData)
      setBookedLectures(bookedLecturesData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleGenerateTimetables = async () => {
    try {
      const response = await fetch('/api/generate-timetables/')
      const data = await response.json()
      setTimetables(data)
    } catch (error) {
      console.error('Error generating timetables:', error)
      toast({
        title: "Error",
        description: "Failed to generate timetables. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/book-slot/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.ok) {
        toast({
          title: "Success",
          description: "Lecture booked successfully",
        })
        fetchData()
      } else {
        throw new Error(data.detail || 'An error occurred')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-primary">Timetable Scheduling App</h1>
        <p className="text-xl text-muted-foreground mt-2">Organize your school's schedule with ease</p>
      </header>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Teachers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>{teacher.id}</TableCell>
                    <TableCell>{teacher.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell>{cls.id}</TableCell>
                    <TableCell>{cls.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.id}</TableCell>
                  <TableCell>{subject.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Class Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Number of Lectures</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classSubjects.map((cs) => (
                  <TableRow key={cs.id}>
                    <TableCell>{cs.id}</TableCell>
                    <TableCell>{cs.class_name.name}</TableCell>
                    <TableCell>{cs.subject.name}</TableCell>
                    <TableCell>{cs.teacher.name}</TableCell>
                    <TableCell>{cs.number_of_lectures}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Book a Lecture</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacher">Teacher</Label>
                <Select name="teacher" onValueChange={(value) => handleSelectChange("teacher", value)}>
                  <SelectTrigger id="teacher">
                    <SelectValue placeholder="Select a teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id.toString()}>{teacher.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="class_name">Class</Label>
                <Select name="class_name" onValueChange={(value) => handleSelectChange("class_name", value)}>
                  <SelectTrigger id="class_name">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select name="subject" onValueChange={(value) => handleSelectChange("subject", value)}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>{subject.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="day">Day</Label>
                <Input type="text" id="day" name="day" onChange={handleInputChange} placeholder="e.g., Monday" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input type="text" id="time" name="time" onChange={handleInputChange} placeholder="e.g., 09:00 AM" />
              </div>
            </div>
            <Button type="submit" className="w-full">Book Lecture</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Booked Lectures</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookedLectures.map((lecture) => (
                  <TableRow key={lecture.id}>
                    <TableCell>{lecture.teacher.name}</TableCell>
                    <TableCell>{lecture.class_name.name}</TableCell>
                    <TableCell>{lecture.subject.name}</TableCell>
                    <TableCell>{lecture.day}</TableCell>
                    <TableCell>{lecture.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={handleGenerateTimetables} size="lg" className="text-lg">
          Generate Timetables
        </Button>
      </div>

      {timetables && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Timetables</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="teachers" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="teachers">Teachers</TabsTrigger>
                <TabsTrigger value="classes">Classes</TabsTrigger>
              </TabsList>
              <TabsContent value="teachers">
                <ScrollArea className="h-[500px] w-full">
                  {Object.entries(timetables.teachers).map(([teacherName, schedule]) => (
                    <div key={teacherName} className="mb-8">
                      <h3 className="text-xl font-semibold mb-2">{teacherName}</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Class</TableHead>
                            <TableHead>Subject</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {schedule.map((slot, index) => (
                            <TableRow key={index}>
                              <TableCell>{slot.day}</TableCell>
                              <TableCell>{slot.time}</TableCell>
                              <TableCell>{slot.class}</TableCell>
                              <TableCell>{slot.subject}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="classes">
                <ScrollArea className="h-[500px] w-full">
                  {Object.entries(timetables.classes).map(([className, schedule]) => (
                    <div key={className} className="mb-8">
                      <h3 className="text-xl font-semibold mb-2">{className}</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Teacher</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {schedule.map((slot, index) => (
                            <TableRow key={index}>
                              <TableCell>{slot.day}</TableCell>
                              <TableCell>{slot.time}</TableCell>
                              <TableCell>{slot.subject}</TableCell>
                              <TableCell>{slot.teacher}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      <Toaster />
    </div>
  )
}