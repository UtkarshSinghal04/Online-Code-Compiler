const stubs = {};

stubs.cpp = `#include <iostream>
#include <stdio.h>

using namespace std;

int main() {
  cout<<"Hello world!\\n";
  return 0;
}
`;

stubs.py = `print("Hello world!")`;

stubs.c = `#include <stdio.h>

int main() {
    printf("Hello world!\\n");
    return 0;
}
`;

export default stubs;