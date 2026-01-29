// e:/try/app/api/student/resume/route.js
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Student from '@/models/Student';
import dbConnect from '@/lib/dbConnect';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const student = await Student.findOne({ userId: session.user.id });
    if (!student || !student.resume) {
      return NextResponse.json(
        { success: false, message: 'Resume not found' },
        { status: 404 }
      );
    }

    const filePath = path.join(process.cwd(), student.resume);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, message: 'Resume file not found' },
        { status: 404 }
      );
    }

    // Return the file
    const file = fs.readFileSync(filePath);
    const fileExtension = path.extname(filePath).substring(1);

    return new Response(file, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="resume.${fileExtension}"`,
      },
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('resume');

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, message: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    const fileBuffer = await file.arrayBuffer();
    if (fileBuffer.byteLength > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Generate unique filename
    const uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `resume-${uniqueSuffix}.pdf`;
    const filePath = path.join('uploads', 'resumes', filename);

    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(path.join(process.cwd(), filePath), buffer);

    // Update student's resume path in database
    const student = await Student.findOne({ userId: session.user.id });
    if (!student) {
      // Clean up uploaded file if student not found
      fs.unlinkSync(path.join(process.cwd(), filePath));
      return NextResponse.json(
        { success: false, message: 'Student profile not found' },
        { status: 404 }
      );
    }

    // Remove old resume if exists
    if (student.resume) {
      const oldFilePath = path.join(process.cwd(), student.resume);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    student.resume = filePath;
    await student.save();

    return NextResponse.json({
      success: true,
      message: 'Resume uploaded successfully',
      resumePath: filePath,
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}