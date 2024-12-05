import { supabase } from '../utils/supabase';

export default async function handler(req, res) {
  const { data, error } = await supabase.from('test_table').select('*');
  if (error) return res.status(400).json({ error });
  res.status(200).json({ data });
}
