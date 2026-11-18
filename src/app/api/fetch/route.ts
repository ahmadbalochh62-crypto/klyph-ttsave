import { NextRequest, NextResponse } from 'next/server';
import { extractMedia } from '@/lib/extractor';
import { parseFriendlyError } from '@/lib/types';

export const dynamic = 'force-dynamic';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://ttsave.world',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export const revalidate = 0;

// In-memory cache for repeat requests of the same video link (10 min TTL).
// A warm serverless instance returns popular links instantly instead of
// calling TikWM again.
const fetchCache = new Map<string, { at: number; data: unknown }>();
const CACHE_TTL_MS = 10 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please paste a valid video link.',
          errorDetails: {
            title: 'Missing Link',
            message: 'No video link was provided.',
            tip: 'Paste a link into the input box to start downloading.'
          }
        },
        { 
          status: 400,
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            ...CORS_HEADERS,
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    }

    const cleanUrl = url.trim();

    const cached = fetchCache.get(cleanUrl);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
      return NextResponse.json(
        { success: true, data: cached.data },
        {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            ...CORS_HEADERS,
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
    }

    const metadata = await extractMedia(cleanUrl);
    fetchCache.set(cleanUrl, { at: Date.now(), data: metadata });
    return NextResponse.json(
      { success: true, data: metadata },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
            ...CORS_HEADERS,
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (error: any) {
    const rawError = error.message || '';
    const friendly = parseFriendlyError(rawError);

    return NextResponse.json(
      { 
        success: false, 
        error: friendly.message,
        errorDetails: friendly,
        debugError: rawError
      },
      { 
        status: 400,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
            ...CORS_HEADERS,
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  }
}
