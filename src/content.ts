// EDIT ME: all words and media paths live here. Files go in public/media/<path>.
// Text starting with [EDIT] is a placeholder for a real detail only you know.
export type Theme = 'navy' | 'green' | 'ivory'
export type Kind = 'envelope' | 'cover' | 'text' | 'frames' | 'timeline' | 'notes' | 'media' | 'slot' | 'scratch' | 'museum' | 'vinyl' | 'capsule' | 'yesno' | 'puzzle' | 'waxletter' | 'box' | 'bow' | 'rise' | 'tree'
export interface Item { t: string; d: string; img?: string }
export interface Chapter {
  id: string; title: string; kicker: string; theme: Theme; kind: Kind
  body?: string[]; items?: Item[]
  media?: { type: 'video' | 'audio'; src: string; poster?: string }
}
export const PASSCODE = '2511' // her birthday, DDMM. A surprise gate, not real security.
const E = '[EDIT] '
const nums = (n: number) => Array.from({ length: n }, (_, k) => k + 1)
export const chapters: Chapter[] = [
  { id: '01', title: 'The Envelope', kicker: 'For Jinie 🌸', theme: 'navy', kind: 'envelope', body: ['Something small and so precious for my baby, made slowly, just for you so sit back and slowly let it load and scroll it slowly read it and enjoy 🫶🏻'] },
  { id: '02', title: 'Anjani 🩷', kicker: "The Collector's Edition · One copy only", theme: 'green', kind: 'cover', items: [{ t: 'Her in my eyes', d: 'ILY' }, { t: 'The bus, the diary, the little things till now ', d: '23-26' }, { t: ' Something for every mood to make lighter', d: '25th' }] },
  { id: '03', title: "The Editor's Note", kicker: 'And her day starts 😚🧿', theme: 'ivory', kind: 'yesno', body: [
    'Hellow my Anjani.',
    'Most magazines are made for thousands of people. This one is made for exactly one, and she is the only reader that matters to me.',
    'It started on a bus, with a conversation and look how far that little beginning has brought us. From our college memories to TRP Mall, our first kiss and all those silly little moments that became ours. Everything in here is a little proof of that.',
    E + 'I made this to keep a little piece of our story somewhere special, because my favourite memories will always have you in them also its your day so it has to be something special.',
    'So sit comfortably, tap everything, and take your time. ♡'] },
  { id: '04', title: 'Her, in Frame 🌸', kicker: 'Photography', theme: 'navy', kind: 'scratch', items: [
    ['Our Moments 😚', 'the one that shows up before you decide to kiss me '], ['The look', 'the one that says "really? and asks how she is so beautiful 😭"'], ['My Pookie 🎀', 'impossible to say her she looks so much adorable and she is the bestest '],
    ['Her Cuteness ', 'How can someone look this pretty without even trying'], ['The in-between', 'Even the camera knows you're special'], ['The you in my eyes', 'And somehow I still can't get enough of you']]
    .map(([t, d], n) => ({ t, d: d + ' ' + E + 'swap for a real caption', img: `photos/frame-${n + 1}.jpg` })) },
  { id: '05', title: 'It is Your Day 🫣💕', kicker: 'Fix the photo to read our story touch the photos then touch again where it fits 😉', theme: 'ivory', kind: 'puzzle', items: [
    { t: 'The bus', d: 'Two strangers, one bus, and a conversation that decided to stay. Best seat I never planned to take. ' + E + 'the first convocation day to the our convocation day ... time flew and we grew 🫶🏻' },
    { t: 'The diary', d: 'I made you a diary, because some things deserve to be written down and kept. Every page was a way of saying "I was thinking of you". ' + E + 'Then came all those little college moments with what i made for you.' },
    { t: 'Movies & small moments', d: 'We collect them: films, snacks, silly arguments, ordinary evenings that turned out not to be ordinary. ' + E + 'From teri Bato mai uljha jiya 😂🤌🏻 to Dhuranadhar .' },
    { t: 'March 6', d: 'A date that quietly changed things. I think about it more than I admit. ' + E + '6 March 2024… our first kiss at TRP Mall.' },
    { t: 'TRP Mall', d: 'Our first kiss. I will remember that place for the rest of my life. ' + E + '5th floor and that bench and countless and so best memories.' },
    { t: 'March 7', d: E + '7 March 2024… the day I asked you to be mine And it was little not professional i admit but 🥹🥹 ... that Kurkure moment became a part of our story too ♡.' }] },
  { id: '06', title: 'The Little Things', kicker: 'Pull the lever', theme: 'green', kind: 'slot', items: [
    { t: 'What i loves most', d: 'The way you get all excited over little things.' },
    { t: 'Your Face', d: 'Those adorable expressions you don't even notice. ' },
    { t: 'Movie nights', d: 'Even a bad film is a good film when you are next to me. ' + E },
    { t: 'TRP Mall', d: 'From Our first kiss yo till today we go to trp and remember everything ... I still smile about it more than I admit.' },
    { t: 'Your little habits', d: E + 'like when yiu get angry and slaps me and then kiss my cheek.' },
    { t: 'Just you', d: 'No reason needed. Happiest birthday my Anjiiii ♡' }] },
  { id: '07', title: 'The Archive', kicker: 'Exhibition from First Bday to This one (yet to be added) ', theme: 'ivory', kind: 'museum', items: nums(6).map(n => ({ t: `Exhibit ${String(n).padStart(2, '0')}`, d: E + 'Look how much we've grown since this one', img: `photos/memory-${n}.jpg` })) },
  { id: '08', title: 'The Birthday Box', kicker: 'Open when…', theme: 'navy', kind: 'box', items: [
    ['you miss me', 'Close your eyes for ten seconds. I am doing the same thing right now. ♡'],
    ['you feel low', 'You are allowed to have a bad day. You are not allowed to forget how loved you are.'],
    ['you need a smile', 'Remember the bus? Neither of us planned any of this. Smile, the universe has a story for us babe🧿'],
    ['you cannot sleep', 'Breathe in slowly. Whatever is loud in your head can wait until tomorrow. I will be here and you can call me anytime.'],
    ['you need reassurance', 'You are enough, exactly as you are today. ' + E + 'i was yours i am yours and i will be yours hamesha.'],
    ['you want to remember us', 'Think of the bus, the diary, March 6, TRP Mall. Then smile, and call me.']].map(([t, d]) => ({ t: 'Open when ' + t, d })) },
  { id: '09', title: 'The Love Letter', kicker: 'Break the seal', theme: 'ivory', kind: 'waxletter', body: [
    'Dear Anjani,',
    'I do not have a perfect sentence for what you are to me. So I wrote a whole magazine and hoped it would add up to one.',
    E + 'I hope you never doubt how capable you are… you have so much potential in you and I wish you could see yourself the way I see you.',
    E + 'I know you have your own dreams… your goals… and days when things might feel difficult, but please never underestimate yourself. You are capable of so much more than you realise and I genuinely believe you’ll achieve everything you work so hard for 🥹🫶🏻🧿.',
    'Happy birthday my girl… I’m always going to be your biggest admirer ♡.'] },
  { id: '10', title: 'A Little Film', kicker: 'Cinema', theme: 'green', kind: 'media', media: { type: 'video', src: 'videos/film.mp4', poster: 'photos/film-poster.jpg' } },
  { id: '11', title: 'The Soundtrack for you ', kicker: 'Side A', theme: 'navy', kind: 'vinyl', media: { type: 'audio', src: 'audio/song.mp3' } },
  { id: '12', title: 'Pop the Hearts like touch the bow and aim at any heart', kicker: 'Aim, shoot, smile', theme: 'green', kind: 'bow', items: [
    ['Bullseye!', 'Found one. Proof that you are impossible to miss.'],
    ['Pop!', 'Reminder: you are somebody’s favourite person. Mine.'],
    ['Nice aim', 'Whatever you aim for this year, you will hit it💯🫡'],
    ['Cupid called', 'I would choose our little world again.'],
    ['Little secret', E + 'I love to give tou teas and i love to hear it from you'],
    ['Last one!', 'Happy birthday, Anjani. Thank you for being you ♡You're my favourite notification']].map(([t, d]) => ({ t, d })) },
  { id: '13', title: 'Make a Wish', kicker: 'Our forever', theme: 'navy', kind: 'rise', body: ['Happy', 'Birthday'], items: [
    { t: '🥹🧿', d: 'I wish you always keep that beautiful smile. ' + E },
    { t: '😚🌸', d: 'I wish you achieve everything you're working for .' },
    { t: 'More of you', d: 'I wish life gives you more reasons to be happy.' },
    { t: 'Our promise', d: E + 'and i promise thay i will be with you in every situation.' }] },
  { id: '14', title: 'The Last Page', kicker: 'Fin', theme: 'ivory', kind: 'capsule', body: [
    'You made it to the last page.',
    'Whatever the year brings, I hope it brings you softness, luck, and people who adore you.',
    E + 'And that's the end of this little magazine… but never the end of my favourite story. Happy birthday Anjani… here's to everything we've been and everything that's still waiting for us ♡.',
    'A little love from me… growing with every memory ♡ Happy birthday, Partner ♡  '] },
  { id: '15', title: 'The Edition Archive', kicker: 'Revisit', theme: 'ivory', kind: 'tree', body: ['Here is to a year that blossoms'] },
]
