import sys
import re

# The infile is the file of Reddit submissions.
# Should be in format "olympics-rs-yyyy-mm.txt" for later processing.
infile = sys.argv[1]
# Set icrement for unique file output.
x = 0

with open(infile, 'r') as f:
    for line in f:
        # Get title of each Reddit submission.
        title = re.search(r"(?<=title\":\")(.*?)(?=\")", line).group(0)
        # Set output filename to store submissions separately.
        prep = "-"+str(x)+".txt"
        outfile = infile.replace(".txt", prep).replace("data", "results")
        # Store file
        with open(outfile, 'w') as of:
            of.write(title)
        
        # Update increment
        x = x+1
        