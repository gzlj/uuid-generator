//import something from /root/go/src/github.com/Azure/brigade/brigade-worker/src/brigadier.ts
const { events, Job, Group} = require("brigadier")

/**
 * events is the main event registry.
 *
 * New event handlers can be registered using `events.on(name: string, (e: BrigadeEvent, p: Project) => {})`.
 * where the `name` is the event name, and the callback is the function to be
 * executed when the event is triggered.
 */
//注册新的事件处理程序: events.on(name: string, (e: BrigadeEvent, p: Project) => {})
events.on("push", (e, p) => {
var jsTest = new Job("brigade-hello-compile", "192.168.1.200:5000/compileimage-java:maven-3.3.9_jdk-8");
//更新Job对象的成员变量tasks，它是一个string数组
jsTest.tasks = [
    "cd /src/",
   "mvn clean install",
   "cp /src/target/demo-0.0.1-SNAPSHOT.jar /mnt/brigade/share/"
];
//设置Job对象执行任务的最长时间
jsTest.timeout = 1000000
console.log("==> handling an 'exec' event")

//runimage-java:jre-8
var test = new Job("brigade-buildimages", "docker:latest");
test.docker.enabled=true
test.tasks = [
    "docker version",
	"docker info",
    "cd /mnt/brigade/share/",
      `cat > Dockerfile << EOF
From 192.168.1.200:5000/runimage-java:jre-8
COPY ./demo-0.0.1-SNAPSHOT.jar /opt
WORKDIR /opt
CMD java -jar demo-0.0.1-SNAPSHOT.jar
EOF`,
     "docker build -t testcentos:2.0 ./",
"docker images"
];
    
jsTest.storage.enabled = true
test.storage.enabled = true

//jsTest.run().then(test.run());
//test.run().then();
Group.runEach([jsTest, test]);
})
