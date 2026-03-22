const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = "https://bmmdlvtjsldstwodiynz.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtbWRsdnRqc2xkc3R3b2RpeW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNTUwNDUsImV4cCI6MjA4ODczMTA0NX0.J2NzxgpJP03_QklZqGa_QOtW8BtCpsDIfcRbM4AHuRg"

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase